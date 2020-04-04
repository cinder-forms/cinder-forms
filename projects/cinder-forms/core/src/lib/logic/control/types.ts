import { ArrayElement, UnionToIntersection } from '../utils/types';
import { CinderControlState, UnknownValidators, Validator } from './init/types';

// Summaries
/**
 * A summary of a `CinderControlState`. Contains additional information.
 */
export interface CinderControl<T, TValidators extends UnknownValidators<T> = UnknownValidators<T>>
  extends CinderControlState<T, TValidators> {
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
   * Uses the `intialValue` property of the `CinderControlState`.
   *
   * @see  `CinderControlState`
   */
  changed: boolean;
}

export type ValidatorsToErrors<TValidators extends Array<Validator<any, any>>> = Partial<
  UnionToIntersection<ReturnType<ArrayElement<TValidators>>>
>;
