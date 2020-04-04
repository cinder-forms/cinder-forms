import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import {
  FormControlErrors,
  FormControlState,
  UnknownValidators,
  Validator,
} from './logic/control/init/types';

/**
 * Converts one or multiple Angular validators for the usage with this framework.
 * Does **not** support asynchronous validators.
 * Uses Validators.compose from @angular/forms.
 *
 * Only a subset of properties is available for the Angular validators:
 * `value, dirty, pristine, touched, untouched, enabled, disabled`
 * @param fn Angular validator function..
 */
export function validatorOf<T>(...fn: ValidatorFn[]): Validator<T, any> {
  const composed = Validators.compose(fn)!;

  return (control: FormControlState<T, any>) =>
    composed({
      value: control.value,
      pristine: !control.dirty,
      dirty: control.dirty,
      untouched: !control.touched,
      touched: control.touched,
      enabled: !control.disabled,
      disabled: control.disabled,
    } as AbstractControl) || {};
}

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
export function createValidator<T extends any, TErrors extends FormControlErrors>(
  isInvalid: (control: FormControlState<T, UnknownValidators<T>>) => boolean,
  buildError: (control: FormControlState<T, UnknownValidators<T>>) => TErrors
): Validator<T, Partial<TErrors>> {
  return (control: FormControlState<T, UnknownValidators<T>>) =>
    isInvalid(control) ? buildError(control) : {};
}
