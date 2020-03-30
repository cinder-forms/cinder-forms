import { initFormControl } from '../../control/init/init';
import { FormControls } from '../../control/init/types';
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
