import { FormControlState, FormControlSummary } from '../../../types';
import { GroupStateControls } from '../state/types';
import { GroupControls } from '../types';

export function mapGroupStateControls<TStateControls extends GroupStateControls, R>(
  controls: TStateControls,
  mapFunc: (control: FormControlState<any, any>, key: string) => R
): {
  [K in keyof TStateControls]: R;
} {
  return mapFormControls<TStateControls, R>(controls, mapFunc);
}

export function mapGroupControls<TControls extends GroupControls, R>(
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
