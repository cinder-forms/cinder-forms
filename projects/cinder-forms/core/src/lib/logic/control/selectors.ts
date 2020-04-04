import { circularDeepEqual } from 'fast-equals';
import { CinderControlState, UnknownValidators } from './init/types';
import { CinderControl, ValidatorsToErrors } from './types';
import { mergeControlErrors } from './utils/merge';

/**
 * Creates a `CinderControl` from the given `CinderControlState`.
 * It is possible to add additional errors.
 *
 * @param control The `CinderControlState` which is used to create the `CinderControl`.
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
    changed: getControlChanged(control),
  };
}

function getControlErrors<T, TValidators extends UnknownValidators<T>>(
  control: CinderControlState<T, TValidators>
): ValidatorsToErrors<TValidators>[] {
  return control.validators.map((validator) => validator(control));
}

function getControlChanged<T>(control: CinderControlState<T, any>): boolean {
  return !circularDeepEqual(control.value, control.initialValue);
}
