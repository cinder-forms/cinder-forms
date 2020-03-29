import { reduceFormControl } from '../../../reducer';
import { FormControls, FormControlState } from '../../../types';
import { mapFormControls } from '../../../utils';
import { CinderGroupState, GroupStateControls, UnkownGroupStateValidator } from '../state/types';
import { CinderGroupUpdate } from './types';

/**
 * Returns a `CinderGroupState` which represents the input state with the applied update.
 * The returned value is a new constructed object, except when the update is invalid.
 *
 * @param control The `CinderGroupState` which the update will be applied to.
 * @param update The `CinderGroupUpdate` that will be applied.
 */
export function reduceGroupState<
  TControls extends FormControls,
  TGroupValidators extends UnkownGroupStateValidator<TControls>[]
>(
  state: CinderGroupState<TControls, TGroupValidators>,
  update: CinderGroupUpdate<TControls, TGroupValidators>
) {
  if (!update) {
    return state;
  }

  return {
    ...state,
    ...update,
    controls: {
      ...state.controls,
      ...(update.controls
        ? mapGroupStateControls(state.controls, (control, key) =>
            reduceFormControl(control, update[key])
          )
        : {})
    }
  };
}

function mapGroupStateControls<TStateControls extends GroupStateControls, R>(
  controls: TStateControls,
  mapFunc: (control: FormControlState<any, any>, key: string) => R
): {
  [K in keyof TStateControls]: R;
} {
  return mapFormControls<TStateControls, R>(controls, mapFunc);
}