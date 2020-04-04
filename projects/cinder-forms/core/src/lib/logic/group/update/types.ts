import { CinderControlState, FormControlUpdate } from '../../control/init/types';
import { CinderGroupState, GroupStateControls, UnkownGroupStateValidator } from '../state/types';

type toFormControlUpdate<TControlState> = TControlState extends CinderControlState<
  infer T,
  infer TControls
>
  ? FormControlUpdate<T, TControls>
  : never;

export type toGroupUpdateControls<TControls extends GroupStateControls> = {
  [K in keyof TControls]?: toFormControlUpdate<TControls[K]>;
};

export type toGroupUpdate<TGroupState> = TGroupState extends CinderGroupState<
  infer TGroupStateControls,
  infer TGroupValidators
>
  ? CinderGroupUpdate<TGroupStateControls, TGroupValidators>
  : never;

export interface CinderGroupUpdate<
  TControls extends GroupStateControls,
  TGroupValidators extends UnkownGroupStateValidator<TControls>[]
> {
  controls?: toGroupUpdateControls<TControls> | TControls;
  validators?: TGroupValidators;
}
