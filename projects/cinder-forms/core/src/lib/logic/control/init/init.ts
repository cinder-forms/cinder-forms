import { reduceControlState } from '../reset/reducer';
import {
  CinderControlInit,
  CinderControlInitTuple,
  CinderControlInitUpdate,
  CinderControlState,
  UnknownValidators,
} from './types';

/**
 * Initializes a new `CinderControlState`.
 *
 * Overload fallback.
 */
export function initControlState<T, TValidators extends UnknownValidators<T>>(
  init: CinderControlInit<T, TValidators>
): CinderControlState<T, TValidators> {
  return Array.isArray(init) ? initControlStateFromTuple(init) : initControlStateFromUpdate(init);
}

function initControlStateFromTuple<T, TValidators extends UnknownValidators<T>>([
  value,
  // TODO: Remove this type hack. Currently invisible to the the outer API.
  validators = [] as any,
  disabled = false,
]: CinderControlInitTuple<T, TValidators>): CinderControlState<T, TValidators> {
  return initControlStateFromUpdate({ value, validators, disabled });
}

function initControlStateFromUpdate<T, TValidators extends UnknownValidators<T>>(
  initialUpdate: CinderControlInitUpdate<T, TValidators>
): CinderControlState<T, TValidators> {
  return reduceControlState<T, TValidators>(
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
