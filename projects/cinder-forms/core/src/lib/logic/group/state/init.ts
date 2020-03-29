import { initFormControl } from '../../../init';
import { FormControls, GroupBuilder } from '../../../types';
import { CinderGroupState, GroupStateValidator, UnkownGroupStateValidator } from './types';

export function initGroup<
  TControls extends FormControls,
  TGroupValidators extends UnkownGroupStateValidator<TControls>[]
>(
  builder: GroupBuilder<TControls>,
  validators: TGroupValidators = [] as any
): CinderGroupState<TControls, TGroupValidators> {
  return {
    controls: builder(initFormControl),
    validators
  };
}
