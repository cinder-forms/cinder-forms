import { CinderControlState, CinderControlUpdate } from '../../control/init/types';
import { CinderGroupState, GroupStateControls, UnkownGroupStateValidator } from '../state/types';

type toCinderControlUpdate<TControlState> = TControlState extends CinderControlState<
  infer T,
  infer TControls
>
  ? CinderControlUpdate<T, TControls>
  : never;

export type toGroupUpdateControls<TControls extends GroupStateControls> = {
  [K in keyof TControls]?: toCinderControlUpdate<TControls[K]>;
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
