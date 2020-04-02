import { FormControlState, UnionToIntersection, UnknownValidators, Validator } from './init/types';

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

export type ValidatorsToErrors<TValidators extends Array<Validator<any, any>>> = Partial<
  UnionToIntersection<ReturnType<ArrayElement<TValidators>>>
>;

type ArrayElement<T extends Array<any>> = T extends (infer U)[] ? U : never;
