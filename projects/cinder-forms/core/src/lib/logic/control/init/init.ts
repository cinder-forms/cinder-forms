import { reduceFormControl } from '../reset/reducer';
import {
  FormControlInit,
  FormControlInitTuple,
  FormControlInitUpdate,
  CinderControlState,
  UnknownValidators,
} from './types';

/**
 * Initializes a new `FormControlState`.
 *
 * Overload fallback.
 */
export function initControlState<T, TValidators extends UnknownValidators<T>>(
  init: FormControlInit<T, TValidators>
): CinderControlState<T, TValidators> {
  return Array.isArray(init) ? initControlStateFromTuple(init) : initControlStateFromUpdate(init);
}

function initControlStateFromTuple<T, TValidators extends UnknownValidators<T>>([
  value,
  // TODO: Remove this type hack. Currently invisible to the the outer API.
  validators = [] as any,
  disabled = false,
]: FormControlInitTuple<T, TValidators>): CinderControlState<T, TValidators> {
  return initControlStateFromUpdate({ value, validators, disabled });
}

function initControlStateFromUpdate<T, TValidators extends UnknownValidators<T>>(
  initialUpdate: FormControlInitUpdate<T, TValidators>
): CinderControlState<T, TValidators> {
  return reduceFormControl<T, TValidators>(
    {
      value: initialUpdate.value,
      initialValue: initialUpdate.value,
      dirty: false,
      touched: false,
      disabled: false,
      // TODO: Remove this type hack. Currently invisible to the the outer API.
      validators: [] as any,
    },
    initialUpdate
  );
}
