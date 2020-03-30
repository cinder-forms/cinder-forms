import { FormControlState, FormControlUpdate, UnknownValidators } from './logic/control/init/types';

/**
 * Returns a `FormControlState` which represents the input state with the applied update.
 * The returned value is a new constructed object, except when the update is invalid.
 *
 * @param control The `FormControlState` which the update will be applied to.
 * @param update The `FormControlUpdate` itself.
 */
export function reduceFormControl<T, TValidators extends UnknownValidators<T>>(
  control: FormControlState<T, TValidators>,
  update: FormControlUpdate<T, TValidators>
): FormControlState<T, TValidators> {
  if (!update) {
    return control;
  }

  return {
    ...control,
    ...update
  };
}
