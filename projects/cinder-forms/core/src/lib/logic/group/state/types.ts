import { initControlState } from '../../control/init/init';
import {
  ControlErrors,
  CinderControlInit,
  CinderControlInitTuple,
  CinderControlInitUpdate,
  CinderControlState,
  UnknownValidators,
} from '../../control/init/types';

export interface BaseControls {
  [key: string]: any;
}

export interface GroupStateControls {
  [key: string]: CinderControlState<any, any>;
}

// Builder Functions
export type GroupBuilder<RStateControls extends GroupStateControls> = (
  init: typeof initControlState
) => RStateControls;

export type GroupInit<TControls extends {}> = {
  [K in keyof TControls]: CinderControlInit<TControls[K], UnknownValidators<TControls[K]>>;
};

export type toControlState<TControlInit> = TControlInit extends CinderControlInitTuple<
  infer TTuple,
  infer TTupleValidators
>
  ? CinderControlState<TTuple, TTupleValidators>
  : TControlInit extends CinderControlInitUpdate<infer TUpdate, infer TUpdateValidators>
  ? CinderControlState<TUpdate, TUpdateValidators>
  : never;

export type toGroupStateControls<TGroupInit extends BaseControls> = {
  [K in keyof TGroupInit]: toControlState<TGroupInit[K]>;
};

export interface GroupValidators {
  [key: string]: UnknownValidators<any>;
}

export interface GroupErrors {
  [key: string]: ControlErrors;
}

export interface CinderGroupState<
  TControls extends GroupStateControls,
  TGroupValidators extends UnkownGroupStateValidator<TControls>[]
> {
  controls: TControls;
  validators: TGroupValidators;
}

export type GroupStateValidator<
  TControls extends GroupStateControls,
  TErrors extends GroupErrors
> = (group: CinderGroupState<TControls, UnkownGroupStateValidator<TControls>[]>) => TErrors;

export type UnkownGroupStateValidator<TControls extends GroupStateControls> = GroupStateValidator<
  TControls,
  { [key in keyof TControls]: any }
>;
