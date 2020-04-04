import { selectControl } from '../control/selectors';
import { CinderControl } from '../control/types';
import {
  CinderGroupState,
  GroupErrors,
  GroupStateControls,
  UnkownGroupStateValidator,
} from './state/types';
import {
  CinderGroup,
  GroupControls,
  mergeErrors,
  stateControlsToGroupErrors,
  toGroupControls,
  toGroupErrors,
} from './types';
import { mapGroupControls, mapGroupStateControls } from './utils/map';
import { mergeGroupErrors } from './utils/merge';

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
  TControls extends toGroupControls<TStateControls>,
  TAdditionalErrors extends GroupErrors
>(
  groupState: CinderGroupState<TStateControls, TGroupStateValidators>,
  additionalErrors: Array<TAdditionalErrors> = []
): CinderGroup<TStateControls, TGroupStateValidators, TAdditionalErrors> {
  const controls = selectGroupControls<TControls, TStateControls, TGroupStateValidators>(
    groupState
  );

  const groupErrors = selectGroupStateErrors(groupState);
  const controlErrors = selectGroupControlErrors<TStateControls>(controls);

  const errors = mergeGroupErrors(groupErrors, controlErrors, ...additionalErrors) as mergeErrors<
    TStateControls,
    TGroupStateValidators,
    TAdditionalErrors
  >;

  return {
    dirty: someGroupControl(controls, (control) => control.dirty),
    changed: someGroupControl(controls, (control) => control.changed),
    invalid: someGroupControl(controls, (control) => control.invalid),
    touched: someGroupControl(controls, (control) => control.touched),
    validators: groupState.validators,
    controls,
    errors,
  };
}

function selectGroupControlErrors<TStateControls extends GroupStateControls>(
  controls: toGroupControls<TStateControls>
): stateControlsToGroupErrors<TStateControls> {
  return mapGroupControls(controls, (control) => control.errors);
}

function selectGroupStateErrors<
  TStateControls extends GroupStateControls,
  TGroupValidators extends UnkownGroupStateValidator<TStateControls>[]
>(groupState: CinderGroupState<TStateControls, TGroupValidators>): toGroupErrors<TGroupValidators> {
  return (mergeGroupErrors(
    ...groupState.validators.map((validator) => validator(groupState))
  ) as unknown) as toGroupErrors<TGroupValidators>;
}

function selectGroupControls<
  TControls extends GroupControls,
  TStateControls extends GroupStateControls,
  TGroupValidators extends UnkownGroupStateValidator<TStateControls>[]
>(groupState: CinderGroupState<TStateControls, TGroupValidators>) {
  return mapGroupStateControls(groupState.controls, (control, key) =>
    selectControl(control)
  ) as TControls;
}

function someGroupControl<TControls extends GroupControls>(
  controls: TControls,
  evaluate: (control: CinderControl<any, any>) => boolean
) {
  return Object.values(controls).some((control) => evaluate(control));
}
