import { ControlErrors, CinderControlState, UnknownValidators, Validator } from '../init/types';

/**
 * This function can be used to create a new validator.
 * The `isInvalid` function evaluates whether an error should be returned.
 * The error itself is build by the `buildError` function.
 *
 * @param isInvalid Function that evaluates to a boolean.
 *                  If truthy the Validator will return the error.
 * @param buildError Function that builds the error, which will be returned.
 *
 * @returns The error from `buildError` or `{}` if truthy.
 *
 * @example
 * const notEmpty = createValidator(
 *   control => control.value !== '',
 *   _ => ({ empty: true })
 * );
 */
export function createValidator<T extends any, TErrors extends ControlErrors>(
  isInvalid: (control: CinderControlState<T, UnknownValidators<T>>) => boolean,
  buildError: (control: CinderControlState<T, UnknownValidators<T>>) => TErrors
): Validator<T, Partial<TErrors>> {
  return (control: CinderControlState<T, UnknownValidators<T>>) =>
    isInvalid(control) ? buildError(control) : {};
}
