import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { FormControlState, Validator } from '../init/types';

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
