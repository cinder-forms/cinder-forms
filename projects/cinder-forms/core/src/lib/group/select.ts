import { getFormControlSummary } from '../selectors';
import { FormControlState, FormControlSummary } from '../types';
import { CinderGroupState, GroupStateControls, UnkownGroupStateValidator } from './state/types';
import { CinderGroup, GroupControls, toGroupControls } from './types';

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

  const errors = mapGroupControls(controls, control => control.errors);

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

function mapGroupStateControls<TStateControls extends GroupStateControls, R>(
  controls: TStateControls,
  mapFunc: (control: FormControlState<any, any>, key: string) => R
): {
  [K in keyof TStateControls]: R;
} {
  return mapFormControls<TStateControls, R>(controls, mapFunc);
}

function mapGroupControls<TControls extends GroupControls, R>(
  controls: TControls,
  mapFunc: (control: FormControlSummary<any, any>, key: string) => R
): {
  [K in keyof TControls]: R;
} {
  return mapFormControls<TControls, R>(controls, mapFunc);
}

function mapFormControls<TControls extends {}, R>(
  controls: {},
  mapFunc: (control: {}, key: string) => R
): {
  [K in keyof TControls]: R;
} {
  const result = Object.entries<{}>(controls)
    .map(([key, control]) => ({
      [key]: mapFunc(control, key)
    }))
    .reduce((ctrl1, ctrl2) => ({ ...ctrl1, ...ctrl2 }), {});

  return result as {
    [K in keyof TControls]: R;
  };
}
