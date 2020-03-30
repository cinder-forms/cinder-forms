import { circularDeepEqual } from 'fast-equals';
import {
  FormControlErrors,
  FormControlState,
  FormControlSummary,
  UnknownValidators,
  ValidatorsToErrors
} from './logic/control/init/types';
import { mergeFormControlErrors } from './utils';

function containsError(errors: FormControlErrors) {
  return Object.keys(errors).length === 0;
}

export function getFormControlErrors<T, TValidators extends UnknownValidators<T>>(
  control: FormControlState<T, TValidators>
): ValidatorsToErrors<TValidators>[] {
  return control.validators.map(validator => validator(control));
}

export function getFormControlChanged<T>(control: FormControlState<T, any>): boolean {
  return !circularDeepEqual(control.value, control.initialValue);
}

/**
 * Creates a `FormControlSummary` from the given `FormControlState`.
 * It is possible to add additional errors.
 *
 * @param control The `FormControlState` which is used to create the `FormControlSummary`.
 * @param additionalErrors An array of `FormControlErrors` which will be merged into the errors of the control.
 */
export function getFormControlSummary<T, TValidators extends UnknownValidators<T>>(
  control: FormControlState<T, TValidators>,
  ...additionalErrors: ValidatorsToErrors<TValidators>[]
): FormControlSummary<T, TValidators> {
  const errors = mergeFormControlErrors(
    ...getFormControlErrors<T, TValidators>(control),
    ...additionalErrors
  );

  return {
    ...control,
    errors,
    invalid: Object.keys(errors).length > 0,
    changed: getFormControlChanged(control)
  };
}
