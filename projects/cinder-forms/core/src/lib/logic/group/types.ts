import { CinderControlState } from '../control/init/types';
import { CinderControl, ValidatorsToErrors } from '../control/types';
import { UnionToIntersection } from '../utils/types';
import {
  GroupErrors,
  GroupStateControls,
  GroupStateValidator,
  UnkownGroupStateValidator,
} from './state/types';
import { NO_GROUP_ERROR } from './validator/validator';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};

// Controls:
export interface GroupControls {
  [key: string]: CinderControl<any, any>;
}

type toControl<TControlState> = TControlState extends CinderControlState<infer T, infer TControls>
  ? CinderControl<T, TControls>
  : never;

export type toGroupControls<TControls extends GroupStateControls> = {
  [K in keyof TControls]: toControl<TControls[K]>;
};

// Errors:
export type toGroupError<
  TGroupValidator extends GroupStateValidator<any, any>
> = UnionToIntersection<ReturnType<TGroupValidator>>;

export type toGroupErrors<TGroupValidators> = TGroupValidators extends Array<infer TGroupValidator>
  ? TGroupValidator extends GroupStateValidator<any, any>
    ? toGroupError<TGroupValidator>
    : never
  : never;

export type stateControlsToGroupErrors<TStateControls extends GroupStateControls> = {
  [K in keyof TStateControls]: ValidatorsToErrors<TStateControls[K]['validators']>;
};

export type controlToGroupErrors<TControls extends GroupControls> = stateControlsToGroupErrors<
  toGroupControls<TControls>
>;

export type mergeErrors<
  TStateControls extends GroupStateControls,
  TGroupValidators extends UnkownGroupStateValidator<TStateControls>[],
  TGroupErrors extends GroupErrors
> = DeepPartial<
  stateControlsToGroupErrors<TStateControls> & toGroupErrors<TGroupValidators> & TGroupErrors
>;

// Type:
export interface CinderGroup<
  TStateControls extends GroupStateControls,
  TGroupValidators extends UnkownGroupStateValidator<TStateControls>[],
  TAdditionalErrors extends GroupErrors = typeof NO_GROUP_ERROR,
  TControls extends toGroupControls<TStateControls> = toGroupControls<TStateControls>
> {
  /**
   * An object containing all controls.
   */
  controls: TControls;

  validators: TGroupValidators;

  /**
   * An object containing all errors. The used keys are the same as for the controls.
   *
   * If no error is found this value is `{}`.
   */
  errors: mergeErrors<TStateControls, TGroupValidators, TAdditionalErrors>;

  /**
   * Indicates whether any of the controls inside this group is invalid.
   */
  invalid: boolean;

  /**
   * Indicates whether any of the values inside this group were changed.
   */
  dirty: boolean;

  /**
   * Indicates whether any control inside this group was visited.
   */
  touched: boolean;

  /**
   * Indicates whether any of the control were changed.
   * Comparison is always with the intial property of the control.
   *
   */
  changed: boolean;
}
