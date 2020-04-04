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
export interface CinderControlUpdate<
  T,
  TValidators extends UnknownValidators<T> = UnknownValidators<T>
> extends Partial<CinderControlState<T, TValidators>> {}

// Initialization
/**
 * A FormControl validator.
 *
 * @param control A FormControl which the validator will be applied on.
 */
export type Validator<T, R extends ControlErrors> = (control: CinderControlState<T, any>) => R;
export type UnknownValidators<T> = Validator<T, {}>[];

/**
 * Can be either of:
 * @see `CinderControlInitTuple`
 * @see `CinderControlInitUpdate`
 */
export type CinderControlInit<T, TValidators extends UnknownValidators<T>> =
  | CinderControlInitTuple<T, TValidators>
  | CinderControlInitUpdate<T, TValidators>;

/**
 * A shorthand to create a new FormControl.
 * - [0]: Initial value of the control.
 * - [1]: Validator array. Optional.
 * - [2]: Disabled state. Default false. Optional.
 */
export type CinderControlInitTuple<T, TValidators extends UnknownValidators<T>> = [
  T,
  TValidators?,
  boolean?
];

/**
 * Explicit type to create a new FormControl.
 *
 * Identical to CinderControlUpdate, except for `value` which is a required attribute here.
 */
export interface CinderControlInitUpdate<T, TValidators extends Validator<T, any>[]>
  extends CinderControlUpdate<T, TValidators> {
  /**
   * Initial value of the control.
   */
  value: T;
}

// Errors
export interface ControlErrors {
  [error: string]: any;
}

// States
/**
 * Represents the state of a single FormControl.
 */
export interface CinderControlState<
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
