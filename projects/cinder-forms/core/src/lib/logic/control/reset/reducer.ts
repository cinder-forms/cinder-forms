import { CinderControlState, CinderControlUpdate, UnknownValidators } from '../init/types';

/**
 * Returns a `CinderControlState` which represents the input state with the applied update.
 * The returned value is a new constructed object, except when the update is invalid.
 *
 * @param control The `CinderControlState` which the update will be applied to.
 * @param update The `CinderControlUpdate` itself.
 */
export function reduceControlState<T, TValidators extends UnknownValidators<T>>(
  control: CinderControlState<T, TValidators>,
  update: CinderControlUpdate<T, TValidators>
): CinderControlState<T, TValidators> {
  if (!update) {
    return control;
  }

  return {
    ...control,
    ...update,
  };
}
