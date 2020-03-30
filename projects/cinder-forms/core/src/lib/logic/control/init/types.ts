// Type Operators

import { initFormControl } from './init';

type UnionToIntersection<U> = (U extends any
? (k: U) => void
: never) extends (k: infer I) => void
  ? I
  : never;

type ArrayElement<T extends Array<any>> = T extends (infer U)[] ? U : never;

export type ValidatorsToErrors<TValidators extends Array<Validator<any, any>>> = Partial<
  UnionToIntersection<ReturnType<ArrayElement<TValidators>>>
>;

// Base structural type
export interface FormControls {
  [key: string]: any;
}

export type ArrayBuilder<R extends FormControlState<any>[]> = (init: typeof initFormControl) => R;

/**
 * Config from CinderForms.
 * For details of the different attributes view the TSDoc of specific attributes.
 */
export interface FormsConfig {
  /**
   * Number of how many milliseconds needs to pass between individual updates of a `FormControl`.
   * There is no delay on the first update and also always an update after the delay.
   */
  throttleTime: number;
  /**
   * Specifies whether only distinct values should be written to a `FormControl`.
   * Only applies to custom inputs added with `ControlValueAccessor`.
   * Prevents update loops and uses [fast-equals](https://www.npmjs.com/package/fast-equals) for comparison.
   */
  distinctWritesOnly: boolean;
}

// Updates
export interface FormControlUpdate<
  T,
  TValidators extends UnknownValidators<T> = UnknownValidators<T>
> extends Partial<FormControlState<T, TValidators>> {}

// Initialization
/**
 * A FormControl validator.
 *
 * @param control A FormControl which the validator will be applied on.
 */
export type Validator<T, R extends FormControlErrors> = (control: FormControlState<T, any>) => R;
export type UnknownValidators<T> = Validator<T, {}>[];

/**
 * Can be either of:
 * @see `FormControlInitTuple`
 * @see `FormControlInitUpdate`
 */
export type FormControlInit<T, TValidators extends UnknownValidators<T>> =
  | FormControlInitTuple<T, TValidators>
  | FormControlInitUpdate<T, TValidators>;

/**
 * A shorthand to create a new FormControl.
 * - [0]: Initial value of the control.
 * - [1]: Validator array. Optional.
 * - [2]: Disabled state. Default false. Optional.
 */
export type FormControlInitTuple<T, TValidators extends UnknownValidators<T>> = [
  T,
  TValidators?,
  boolean?
];

/**
 * Explicit type to create a new FormControl.
 *
 * Identical to FormControlUpdate, except for `value` which is a required attribute here.
 */
export interface FormControlInitUpdate<T, TValidators extends Validator<T, any>[]>
  extends FormControlUpdate<T, TValidators> {
  /**
   * Initial value of the control.
   */
  value: T;
}

// Errors
export interface FormControlErrors {
  [error: string]: any;
}

// States
/**
 * Represents the state of a single FormControl.
 */
export interface FormControlState<
  T extends any,
  TValidators extends UnknownValidators<T> = UnknownValidators<T>
> {
  /**
   * The value of this control.
   */
  value: T;

  /**
   * The initial value of this control.
   */
  initialValue: T;

  /**
   * Indicates whether the value was not yet changed.
   */
  dirty: boolean;

  /**
   * Indicates whether the FormControl was not yet visited.
   */
  touched: boolean;

  /**
   * Indicates whether the FormControl is disabled.
   */
  disabled: boolean;

  /**
   * Validators which will be used to calculate the errors.
   * Mainly used inside the summary creation.
   */
  validators: TValidators;
}

// Summaries
/**
 * A summary of a `FormControlState`. Contains additional information.
 */
export interface FormControlSummary<
  T,
  TValidators extends UnknownValidators<T> = UnknownValidators<T>
> extends FormControlState<T, TValidators> {
  /**
   * An object containing all errors.
   *
   * `{}` if no errors were found.
   */
  errors: ValidatorsToErrors<TValidators>;

  /**
   * Whether the FormControl has any errors.
   */
  invalid: boolean;

  /**
   * Whether the value is the same as the intial set value.
   * Uses the `intialValue` property of the `FormControlState`.
   *
   * @see  `FormControlState`
   */
  changed: boolean;
}
