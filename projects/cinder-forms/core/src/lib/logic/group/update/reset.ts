import { resetFormControl } from '../../../reset';
import { CinderGroupState, GroupStateControls, UnkownGroupStateValidator } from '../state/types';
import { mapGroupStateControls } from '../utils/map';
import { reduceGroupState } from './reduce';

/**
 * Resets a group back to its default values.
 * Internally calls `resetFormControl` for every control.
 *
 * @see `resetFormControl`
 *
 * @param group The `CinderGroupState` which should be used to create the reset.
 */
export function resetGroupState<
  TControls extends GroupStateControls,
  TGroupValidators extends UnkownGroupStateValidator<TControls>[]
>(
  group: CinderGroupState<TControls, TGroupValidators>
): CinderGroupState<TControls, TGroupValidators> {
  const controls = resetGroupStateControls(group.controls);

  return reduceGroupState<TControls, TGroupValidators>(group, { controls });
}

function resetGroupStateControls<TControls extends GroupStateControls>(
  controls: TControls
): TControls {
  return mapGroupStateControls(controls, control => resetFormControl(control)) as TControls;
}
