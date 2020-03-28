import {
  FormArrayControlSummaries,
  FormArrayErrors,
  FormArrayState,
  FormArraySummary,
  FormControlErrors,
  FormControls,
  FormControlState,
  FormControlSummary,
  FormGroupControlStates,
  FormGroupControlSummaries,
  FormGroupErrors,
  FormGroupState,
  FormGroupSummary,
  UnknownValidators,
  ValidatorsToErrors
} from './types';
import {
  mapFormGroupControlStates,
  mapFormGroupControlSummaries,
  mergeFormArrayErrors,
  mergeFormControlErrors,
  mergeFormGroupErrors
} from './utils';

import { circularDeepEqual } from 'fast-equals';

function containsError(errors: FormControlErrors) {
  return Object.keys(errors).length === 0;
}

export function getFormControlErrors<T, TValidators extends UnknownValidators<T>>(
  control: FormControlState<T, TValidators>
): ValidatorsToErrors<TValidators>[] {
  return control.validators.map(validator => validator(control));
}

export function getFormGroupControlSummariesErrors<TControls extends FormControls>(
  summaries: FormGroupControlSummaries<TControls>
): FormGroupErrors<TControls> {
  const errors: FormGroupErrors<TControls> = mapFormGroupControlSummaries(
    summaries,
    summary => summary.errors
  );

  Object.entries(errors)
    .filter(([_, controlErrors]) => containsError(controlErrors))
    .forEach(([key, _]) => delete errors[key]);

  return errors;
}

export function getFormArrayControlSummariesErrors<T>(
  summaries: FormArrayControlSummaries<T>
): FormArrayErrors {
  return summaries.map(summary => summary.errors);
}

export function getFormGroupErrors<TControls extends FormControls>(
  group: FormGroupState<TControls>
): FormGroupErrors<TControls> {
  return mergeFormGroupErrors(...group.validators.map(validator => validator(group)));
}

export function getFormArrayErrors<T>(array: FormArrayState<T>): FormArrayErrors {
  return mergeFormArrayErrors(...array.validators.map(validator => validator(array)));
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

export function getFormGroupControlSummaries<TControls extends FormControls>(
  controls: FormGroupControlStates<TControls>,
  ...additionalErrors: FormGroupErrors<TControls>[]
): FormGroupControlSummaries<TControls> {
  const additionalError = mergeFormGroupErrors(...additionalErrors);

  return mapFormGroupControlStates(controls, (control, key) =>
    getFormControlSummary(control, additionalError[key] || {})
  );
}

export function getFormArrayControlSummaries<T>(
  controls: FormControlState<T, any>[],
  ...additionalErrors: FormArrayErrors[]
): FormControlSummary<T, any>[] {
  const additionalError = mergeFormArrayErrors(...additionalErrors);

  return controls.map((control, i) => getFormControlSummary(control, additionalError[i] || {}));
}

export function getFormGroupDirty<TControls extends FormControls>(
  group: FormGroupState<TControls>
): boolean {
  return Object.values(group.controls).some(control => control.dirty);
}

export function getFormArrayDirty<T>(array: FormArrayState<T>): boolean {
  return array.controls.some(control => control.dirty);
}

export function getFormGroupTouched<TControls extends FormControls>(
  group: FormGroupState<TControls>
): boolean {
  return Object.values(group.controls).some(control => control.touched);
}

export function getFormGroupChanged<TControls extends FormControls>(
  controls: FormGroupControlSummaries<TControls>
): boolean {
  return Object.values(controls).some(control => control.changed);
}

export function getFormArrayChanged<T>(controls: FormArrayControlSummaries<T>): boolean {
  return controls.some(control => control.changed);
}

export function getFormArrayTouched<T>(array: FormArrayState<T>): boolean {
  return array.controls.every(control => control.touched);
}

export function getFormArrayKeys<T>(array: FormArrayState<T>): number[] {
  return array.controls.map((_, i) => i);
}

/**
 * Creates a `FormGroupSummary` from the given `FormGroupState`.
 * It is possible to add additional errors.
 *
 * @param group The input `FormGroupState`. Used to create the `FormGroupSummary`.
 * @param additionalErrors An array of additional `FormGroupErrors`, which will be merged into the errors of the group and of each control.
 */
export function getFormGroupSummary<TControls extends FormControls>(
  group: FormGroupState<TControls>,
  ...additionalErrors: FormGroupErrors<TControls>[]
): FormGroupSummary<TControls> {
  const groupErrors = getFormGroupErrors(group);
  const summaries = getFormGroupControlSummaries(group.controls, groupErrors, ...additionalErrors);
  const errors = getFormGroupControlSummariesErrors(summaries);

  return {
    controls: summaries,
    dirty: getFormGroupDirty(group),
    touched: getFormGroupTouched(group),
    errors,
    invalid: Object.keys(errors).length > 0,
    changed: getFormGroupChanged(summaries),
    validators: group.validators
  };
}

/**
 * Creates a `FormArraySummary` from the given `FormArrayState`.
 * It is possible to add additional errors.
 *
 * @param array The input `FormArrayState`. Used to create the `FormArraySummary`.
 * @param additionalErrors An array of additional `FormArrayErrors`, which will be merged into the errors of the array and of each control.
 */
export function getFormArraySummary<T>(
  array: FormArrayState<T>,
  ...additionalErrors: FormArrayErrors[]
): FormArraySummary<T> {
  const arrayErrors = getFormArrayErrors(array);
  const summaries = getFormArrayControlSummaries(array.controls, arrayErrors, ...additionalErrors);
  const errors = getFormArrayControlSummariesErrors(summaries);

  return {
    controls: summaries,
    keys: getFormArrayKeys(array),
    dirty: getFormArrayDirty(array),
    touched: getFormArrayTouched(array),
    errors,
    invalid: errors.some(error => Object.keys(error).length > 0),
    changed: getFormArrayChanged(summaries),
    validators: array.validators
  };
}
