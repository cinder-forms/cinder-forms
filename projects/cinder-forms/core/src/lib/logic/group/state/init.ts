import { initFormControl } from '../../control/init/init';
import { FormControls } from '../../control/init/types';
import { selectGroup } from '../select';
import { NO_GROUP_ERROR } from '../validator/validator';
import {
  CinderGroupState,
  GroupInit,
  toGroupStateControls,
  UnkownGroupStateValidator
} from './types';

export function initGroup<
  TGroupInit extends GroupInit<FormControls>,
  TControls extends toGroupStateControls<TGroupInit>,
  TGroupValidators extends UnkownGroupStateValidator<TControls>[]
>(
  groupInit: TGroupInit,
  validators: TGroupValidators
): CinderGroupState<TControls, TGroupValidators> {
  return {
    controls: initGroupStateControls(groupInit) as TControls,
    validators
  };
}

function initGroupStateControls<TGroupInit extends GroupInit<FormControls>>(
  groupInit: TGroupInit
): toGroupStateControls<TGroupInit> {
  return Object.entries(groupInit)
    .map(([key, init]) => ({
      [key]: initFormControl(init)
    }))
    .reduce((ctrl1, ctrl2) => ({ ...ctrl1, ...ctrl2 }), {}) as toGroupStateControls<TGroupInit>;
}

const selected = selectGroup(
  initGroup(
    {
      uu: ['', [() => ({ test: false })]]
    },
    [() => ({ uu: { tru: true } })]
  )
);
