import { FormControlState, FormControlSummary, FormControlUpdate } from '../../../types';
import { GroupStateControls, UnkownGroupStateValidator } from '../state/types';

type toFormControlUpdate<TControlState> = TControlState extends FormControlState<
  infer T,
  infer TControls
>
  ? FormControlUpdate<T, TControls>
  : never;

export type toGroupUpdateControls<TControls extends GroupStateControls> = {
  [K in keyof TControls]: toFormControlUpdate<TControls[K]>;
};

export interface CinderGroupUpdate<
  TControls extends GroupStateControls,
  TGroupValidators extends UnkownGroupStateValidator<TControls>[]
> {
  controls?: toGroupUpdateControls<TControls>;
  validators?: TGroupValidators;
}
