// Type Operators

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

// tslint:disable-next-line: no-empty-interface
export interface FormGroupBase<TControls extends FormControls> {}

// tslint:disable-next-line: no-empty-interface
export interface FormArrayBase<T> {}

// Updates
export interface FormControlUpdate<
  T,
  TValidators extends UnknownValidators<T> = UnknownValidators<T>
> extends Partial<FormControlState<T, TValidators>> {}

export interface FormGroupUpdate<TControls extends FormControls>
  extends Partial<FormGroupBase<TControls>> {
  controls?: FormGroupControlUpdates<TControls> | FormGroupControlStates<TControls>;
}

export type FormGroupControlUpdates<TControls extends FormControls> = Partial<
  {
    [K in keyof TControls]: FormControlUpdate<TControls[K], any>;
  }
>;

export type FormArrayControlUpdates<T> = (FormControlUpdate<T, any> | undefined)[];

export interface FormArrayUpdate<T> extends FormArrayBase<T> {
  controls?: FormArrayControlUpdates<T>;
}

// Initialization
/**
 * A FormControl validator.
 *
 * @param control A FormControl which the validator will be applied on.
 */
export type Validator<T, R extends FormControlErrors> = (control: FormControlState<T, any>) => R;
export type UnknownValidators<T> = Validator<T, any>[];

/**
 * A FormGroup validator.
 *
 * @param group A FormGroupState which the validator will be applied on.
 */
export type GroupValidator<TControls> = (
  group: FormGroupState<TControls>
) => FormGroupErrors<TControls>;

/**
 * A FormArray validator.
 *
 * @param array A FormArrayState which the validator will be applied on.
 */
export type ArrayValidator<T> = (group: FormArrayState<T>) => FormArrayErrors;

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
 * An object of keys and associated `FormControlInit`.
 * @see `FormControlInit`
 */
export type FormGroupInit<TControls extends FormControls> = {
  [K in keyof TControls]: FormControlInit<TControls[K], any>;
};

/**
 * An array of `FormControlInit`.
 * @see `FormControlInit`
 */
export type FormArrayInit<T> = FormControlInit<T, any>[];

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

export type FormGroupErrors<TControls extends FormControls> =
  | Partial<
      {
        [K in keyof Partial<TControls>]: FormControlErrors;
      }
    >
  | {
      [K in keyof Partial<TControls>]: FormControlErrors;
    };

export type FormArrayErrors = FormControlErrors[];

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

export type FormGroupControlStates<TControls extends FormControls> = {
  [K in keyof TControls]: FormControlState<TControls[K], any>;
};

/**
 * A FormGroup can contain multiple FormControls of different types, associated to a key.
 */
export interface FormGroupState<TControls extends FormControls> extends FormGroupBase<TControls> {
  /**
   * An object containing all controls of this group.
   */
  controls: FormGroupControlStates<TControls>;

  /**
   * Validators which will be used to calculate the errors.
   * Mainly used inside the summary creation.
   */
  validators: GroupValidator<TControls>[];
}

/**
 * A FormArray can contain any number of FormControls.
 */
export interface FormArrayState<T> extends FormArrayBase<T> {
  /**
   * An array of all controls contained by this form.
   */
  controls: FormControlState<T, any>[];

  /**
   * Validators which will be used to calculate the errors.
   * Mainly used inside the summary creation.
   */
  validators: ArrayValidator<T>[];
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

export type FormGroupControlSummaries<TControls extends FormControls> = {
  [K in keyof TControls]: FormControlSummary<TControls[K], any>;
};

/**
 * A summary of a `FormGroupState`. Contains additional information.
 */
export interface FormGroupSummary<TControls extends FormControls>
  extends FormGroupState<TControls> {
  /**
   * An object containing summaries of all controls.
   */
  controls: FormGroupControlSummaries<TControls>;

  /**
   * An object containing all errors. The used keys are the same as for the controls.
   *
   * If no error is found this value is `{}`.
   */
  errors: FormGroupErrors<TControls>;

  /**
   * Indicates whether any of the FormControlSummaries inside this group are invalid.
   */
  invalid: boolean;

  /**
   * Indicates whether all of the values inside this group were not yet changed.
   */
  dirty: boolean;

  /**
   * Indicates whether any FormControls inside this group were visited.
   */
  touched: boolean;

  /**
   * Indicates whether any of the FormControls was changed.
   * Comparison is always with the intial property of the FormControl.
   *
   * @see `FormControl`
   */
  changed: boolean;
}

/**
 * An array of control summaries.
 */
export type FormArrayControlSummaries<T> = FormControlSummary<T, any>[];

/**
 * A summary of a `FormArrayState`. Contains additional information.
 */
export interface FormArraySummary<T> extends FormArrayState<T> {
  controls: FormArrayControlSummaries<T>;

  /**
   * A convenience number array which contains the keys of the controls.
   *
   * For a array with the length of 2 this would be: `[0, 1]`
   */
  keys: number[];

  /**
   * An array containing all
   */
  errors: FormArrayErrors;

  /**
   * Indicates whether any of the FormControlSummaries inside this array are invalid.
   */
  invalid: boolean;

  /**
   * Indicates whether all of the values inside this array were not yet changed.
   */
  dirty: boolean;

  /**
   * Indicates whether any of the FormControls inside this array were visited.
   */
  touched: boolean;

  /**
   * Indicates whether any of the FormControls was changed.
   * Comparison is always with the intial property of the FormControl.
   *
   * @see `FormControl`
   */
  changed: boolean;
}
