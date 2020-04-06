import { CinderControlState, CinderControlUpdate } from '../control/init/types';
import { CinderControl } from '../control/types';
import { CinderGroupState } from '../group/state/types';
import { CinderGroupUpdate } from '../group/update/types';
import { CinderGroup } from './../group/types';

export type ArrayElement<T extends Array<any>> = T extends (infer U)[] ? U : never;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export type toUpdate<T> = T extends CinderControlState<
  infer TControlValue,
  infer TControlValidators
>
  ? CinderControlUpdate<TControlValue, TControlValidators>
  : T extends CinderGroupState<infer TStateControls, infer TValidators>
  ? CinderGroupUpdate<TStateControls, TValidators>
  : never;

export type toSelected<T> = T extends CinderControlState<
  infer TControlValue,
  infer TControlValidators
>
  ? CinderControl<TControlValue, TControlValidators>
  : T extends CinderGroupState<infer TStateControls, infer TValidators>
  ? CinderGroup<TStateControls, TValidators>
  : never;

export type Without<T, K> = Pick<T, Exclude<keyof T, K>>;
