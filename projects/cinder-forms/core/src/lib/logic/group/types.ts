import { FormControlState, FormControlSummary, ValidatorsToErrors } from '../control/init/types';
import { GroupStateControls, GroupStateValidator, UnkownGroupStateValidator } from './state/types';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};

// Controls:
export interface GroupControls {
  [key: string]: FormControlSummary<any, any>;
}

type toFormControlSummary<TControlState> = TControlState extends FormControlState<
  infer T,
  infer TControls
>
  ? FormControlSummary<T, TControls>
  : never;

export type toGroupControls<TControls extends GroupStateControls> = {
  [K in keyof TControls]: toFormControlSummary<TControls[K]>;
};

// Errors:
export type toGroupError<TGroupValidator> = TGroupValidator extends GroupStateValidator<
  any,
  infer TError
>
  ? TError
  : never;

export type toGroupErrors<TGroupValidators> = TGroupValidators extends Array<infer TGroupValidator>
  ? toGroupError<TGroupValidator>
  : never;

export type stateControlsToGroupErrors<TStateControls extends GroupStateControls> = {
  [K in keyof TStateControls]: ValidatorsToErrors<TStateControls[K]['validators']>;
};

export type controlToGroupErrors<TControls extends GroupControls> = stateControlsToGroupErrors<
  toGroupControls<TControls>
>;

type mergeErrors<
  TStateControls extends GroupStateControls,
  TGroupValidators extends UnkownGroupStateValidator<TStateControls>[]
> = DeepPartial<stateControlsToGroupErrors<TStateControls> & toGroupErrors<TGroupValidators>>;

// Type:
export interface CinderGroup<
  TStateControls extends GroupStateControls,
  TGroupValidators extends UnkownGroupStateValidator<TStateControls>[],
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
  errors: mergeErrors<TStateControls, TGroupValidators>;

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
