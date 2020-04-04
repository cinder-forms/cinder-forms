import { initControlState } from '../init/init';
import { CinderControlState, UnknownValidators } from '../init/types';

/**
 * Resets a control back to the default values.
 * The following values will be ignored and stay the same:
 * - `initialValue`
 * - `validators`
 * - `disabled`
 *
 * @param control The `CinderControlState` which should be used to create the reset.
 * @param initialValue Optional parameter for passing a new initial value.
 */
export function resetControlState<T, TValidators extends UnknownValidators<T>>(
  control: CinderControlState<T, TValidators>,
  initialValue = control.initialValue
): CinderControlState<T, TValidators> {
  return initControlState([initialValue, control.validators, control.disabled]);
}
