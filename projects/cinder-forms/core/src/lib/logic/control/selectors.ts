import { circularDeepEqual } from 'fast-equals';
import { CinderControlState, UnknownValidators } from './init/types';
import { CinderControl, ValidatorsToErrors } from './types';
import { mergeControlErrors } from './utils/merge';

/**
 * Creates a `FormControlSummary` from the given `FormControlState`.
 * It is possible to add additional errors.
 *
 * @param control The `FormControlState` which is used to create the `FormControlSummary`.
 * @param additionalErrors An array of `ControlErrors` which will be merged into the errors of the control.
 */
export function selectControl<T, TValidators extends UnknownValidators<T>>(
  control: CinderControlState<T, TValidators>,
  ...additionalErrors: ValidatorsToErrors<TValidators>[]
): CinderControl<T, TValidators> {
  const errors = mergeControlErrors(
    ...getControlErrors<T, TValidators>(control),
    ...additionalErrors
  );

  return {
    ...control,
    errors,
    invalid: Object.keys(errors).length > 0,
    changed: getFormControlChanged(control),
  };
}

function getControlErrors<T, TValidators extends UnknownValidators<T>>(
  control: CinderControlState<T, TValidators>
): ValidatorsToErrors<TValidators>[] {
  return control.validators.map((validator) => validator(control));
}

function getFormControlChanged<T>(control: CinderControlState<T, any>): boolean {
  return !circularDeepEqual(control.value, control.initialValue);
}
