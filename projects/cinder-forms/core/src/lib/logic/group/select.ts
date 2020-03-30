import { getFormControlSummary } from '../../selectors';
import { FormControlSummary } from '../../types';
import { CinderGroupState, GroupStateControls, UnkownGroupStateValidator } from './state/types';
import { CinderGroup, GroupControls, toGroupControls, toGroupErrors } from './types';
import { mapGroupControls, mapGroupStateControls } from './utils/map';

/**
 * Creates a `CinderGroup` from the given `CinderGroupState`.
 * It is possible to add additional errors.
 *
 * @param group The input `CinderGroupState`. Used to create the `CinderGroup`.
 * @param additionalErrors An array of additional `FormGroupErrors`, which will be merged into the errors of the group and of each control.
 */
export function selectGroup<
  TStateControls extends GroupStateControls,
  TGroupStateValidators extends UnkownGroupStateValidator<TStateControls>[],
  TControls extends toGroupControls<TStateControls>
>(
  groupState: CinderGroupState<TStateControls, TGroupStateValidators>
): CinderGroup<TStateControls, TGroupStateValidators, TControls> {
  const controls = selectGroupControls<TControls, TStateControls, TGroupStateValidators>(
    groupState
  );

  const errors = selectGroupErrors(controls);

  return {
    dirty: someGroupControl(controls, control => control.dirty),
    changed: someGroupControl(controls, control => control.changed),
    invalid: someGroupControl(controls, control => control.invalid),
    touched: someGroupControl(controls, control => control.touched),
    validators: groupState.validators,
    controls,
    errors
  };
}

function selectGroupErrors<TControls extends GroupControls>(controls: toGroupControls<TControls>) {
  return mapGroupControls(controls, control => control.errors) as toGroupErrors<TControls>;
}

function selectGroupControls<
  TControls extends GroupControls,
  TStateControls extends GroupStateControls,
  TGroupValidators extends UnkownGroupStateValidator<TStateControls>[]
>(groupState: CinderGroupState<TStateControls, TGroupValidators>) {
  return mapGroupStateControls(groupState.controls, (control, key) =>
    getFormControlSummary(control)
  ) as TControls;
}

function someGroupControl<TControls extends GroupControls>(
  controls: TControls,
  evaluate: (control: FormControlSummary<any, any>) => boolean
) {
  return Object.values(controls).some(control => evaluate(control));
}
