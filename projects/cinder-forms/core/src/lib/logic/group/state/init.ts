import { initFormControl } from '../../../init';
import { FormControls } from '../../../types';
import { CinderGroupState, GroupBuilder, UnkownGroupStateValidator } from './types';

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
