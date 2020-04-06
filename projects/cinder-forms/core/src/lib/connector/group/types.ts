import { GroupStateControls } from '../../logic/group/state/types';
import { CinderControlState } from '../../logic/control/init/types';

export type possibleUndefinedStateControls<TStateControls extends GroupStateControls> = {
  [K in keyof TStateControls]: TStateControls[K] extends CinderControlState<
    infer T,
    infer TValidators
  >
    ? CinderControlState<T | undefined, TValidators>
    : never;
};
