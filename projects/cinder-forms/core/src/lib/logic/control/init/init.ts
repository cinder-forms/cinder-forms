import { reduceFormControl } from '../reset/reducer';
import {
  FormControlInit,
  FormControlInitTuple,
  FormControlInitUpdate,
  FormControlState,
  UnknownValidators
} from './types';

/**
 * Initializes a new `FormControlState`.
 *
 * Overload fallback.
 */
export function initFormControl<T, TValidators extends UnknownValidators<T>>(
  init: FormControlInit<T, TValidators>
): FormControlState<T, TValidators> {
  return Array.isArray(init) ? initFormControlFromTuple(init) : initFormControlFromUpdate(init);
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
