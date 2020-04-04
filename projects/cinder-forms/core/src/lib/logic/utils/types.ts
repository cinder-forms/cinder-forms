import { CinderControlState, CinderControlUpdate } from '../control/init/types';

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
  : never;
