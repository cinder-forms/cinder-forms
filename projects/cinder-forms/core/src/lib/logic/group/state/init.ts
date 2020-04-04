import { initFormControl } from '../../control/init/init';
import { FormControls, CinderControlState } from '../../control/init/types';
import { toGroupErrors } from '../types';
import {
  CinderGroupState,
  GroupInit,
  GroupStateValidator,
  toGroupStateControls,
  UnkownGroupStateValidator,
} from './types';

export function initGroup<
  TGroupInit extends GroupInit<FormControls>,
  TControls extends toGroupStateControls<TGroupInit>,
  TGroupValidators extends UnkownGroupStateValidator<TControls>[] = GroupStateValidator<
    TControls,
    toGroupErrors<TControls>
  >[]
>(
  groupInit: TGroupInit,
  validators: TGroupValidators = ([] as unknown) as TGroupValidators
): CinderGroupState<TControls, TGroupValidators> {
  return {
    controls: initGroupStateControls(groupInit) as TControls,
    validators,
  };
}

function initGroupStateControls<TGroupInit extends GroupInit<FormControls>>(
  groupInit: TGroupInit
): toGroupStateControls<TGroupInit> {
  return Object.entries(groupInit)
    .map(([key, init]) => ({
      [key]: initFormControl(init),
    }))
    .reduce((ctrl1, ctrl2) => ({ ...ctrl1, ...ctrl2 }), {}) as toGroupStateControls<TGroupInit>;
}
