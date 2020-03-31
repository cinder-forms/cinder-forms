import { initFormControl } from '../init/init';
import { FormControlState, UnknownValidators } from '../init/types';

/**
 * Resets a control back to the default values.
 * The following values will be ignored and stay the same:
 * - `initialValue`
 * - `validators`
 * - `disabled`
 *
 * @param control The `FormControlState` which should be used to create the reset.
 * @param initialValue Optional parameter for passing a new initial value.
 */
export function resetFormControl<T, TValidators extends UnknownValidators<T>>(
  control: FormControlState<T, TValidators>,
  initialValue = control.initialValue
): FormControlState<T, TValidators> {
  return initFormControl([initialValue, control.validators, control.disabled]);
}
