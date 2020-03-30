import { reduceFormControl } from '../../../reducer';
import {
  FormControlInitTuple,
  FormControlInitUpdate,
  FormControlState,
  UnknownValidators
} from './types';

/**
 * Initializes a new `FormControlState`.
 * @param initialUpdate __Required.__ Initial update which will be applied to create the control.
 *                      `Value` is the only required property in the `initialUpdate` object.
 */
export function initFormControl<T, TValidators extends UnknownValidators<T>>(
  initialUpdate: FormControlInitUpdate<T, TValidators>
): FormControlState<T, TValidators>;

/**
 * Initializes a new `FormControlState`.
 * @param value __Required.__ Initial value of the control.
 * @param validators __Required.__ An array of validators used for validating the control.
 *                   Pass `[]` to create without validators.
 * @param disabled __Optional.__ Whether the control is disabled or not
 *                 Defaults to `false`.
 */
export function initFormControl<T, TValidators extends UnknownValidators<T>>(
  value: T,
  validators: TValidators,
  disabled?: boolean
): FormControlState<T, TValidators>;

/**
 * Initializes a new `FormControlState`.
 *
 * Overload fallback.
 */
export function initFormControl<T, TValidators extends UnknownValidators<T>>(
  initOrValue: FormControlInitUpdate<T, TValidators> | T,
  validators?: TValidators,
  disabled = false
): FormControlState<T, TValidators> {
  const value = initOrValue as T;
  const init = initOrValue as FormControlInitUpdate<T, TValidators>;

  return Array.isArray(validators)
    ? initFormControlFromTuple([value, validators, disabled])
    : initFormControlFromUpdate(init);
}

function initFormControlFromTuple<T, TValidators extends UnknownValidators<T>>([
  value,
  // TODO: Remove this type hack. Currently invisible to the the outer API.
  validators = [] as any,
  disabled = false
]: FormControlInitTuple<T, TValidators>): FormControlState<T, TValidators> {
  return initFormControlFromUpdate({ value, validators, disabled });
}

function initFormControlFromUpdate<T, TValidators extends UnknownValidators<T>>(
  initialUpdate: FormControlInitUpdate<T, TValidators>
): FormControlState<T, TValidators> {
  return reduceFormControl<T, TValidators>(
    {
      value: initialUpdate.value,
      initialValue: initialUpdate.value,
      dirty: false,
      touched: false,
      disabled: false,
      // TODO: Remove this type hack. Currently invisible to the the outer API.
      validators: [] as any
    },
    initialUpdate
  );
}
