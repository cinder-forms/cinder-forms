import { never } from 'rxjs';
import {
  FormControlState,
  FormControlSummary,
  UnknownValidators,
  ValidatorsToErrors
} from '../types';
import {
  GroupErrors,
  GroupStateControls,
  GroupStateValidator,
  UnkownGroupStateValidator
} from './state/types';

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

type toFormControlState<TControlSummary> = TControlSummary extends FormControlSummary<
  infer T,
  infer TControls
>
  ? FormControlSummary<T, TControls>
  : never;

export type toGroupStateControls<TControls extends GroupControls> = {
  [K in keyof TControls]: toFormControlState<TControls[K]>;
};

// Validators:
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

// Type:
export interface CinderGroup<
  TStateControls extends GroupStateControls,
  TGroupValidators extends UnkownGroupStateValidator<TStateControls>[],
  TControls extends toGroupControls<TStateControls>
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
  errors: stateControlsToGroupErrors<TStateControls>;

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
