import { initFormControl } from '../../control/init/init';
import {
  FormControlErrors,
  FormControlInit,
  FormControlInitTuple,
  FormControlInitUpdate,
  FormControls,
  FormControlState,
  UnknownValidators
} from '../../control/init/types';

export interface GroupStateControls {
  [key: string]: FormControlState<any, any>;
}

// Builder Functions
export type GroupBuilder<RStateControls extends GroupStateControls> = (
  init: typeof initFormControl
) => RStateControls;

export type GroupInit<TControls extends FormControls> = {
  [K in keyof TControls]: FormControlInit<TControls[K], UnknownValidators<TControls[K]>>;
};

export type toControlState<TControlInit> = TControlInit extends FormControlInitTuple<
  infer TTuple,
  infer TTupleValidators
>
  ? FormControlState<TTuple, TTupleValidators>
  : TControlInit extends FormControlInitUpdate<infer TUpdate, infer TUpdateValidators>
  ? FormControlState<TUpdate, TUpdateValidators>
  : never;

export type toGroupStateControls<TGroupInit extends FormControls> = {
  [K in keyof TGroupInit]: toControlState<TGroupInit[K]>;
};

export interface GroupValidators {
  [key: string]: UnknownValidators<any>;
}

export interface GroupErrors {
  [key: string]: FormControlErrors;
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
> = (
  group: CinderGroupState<TControls, UnkownGroupStateValidator<TControls>[]>
) => Partial<TErrors>;

export type UnkownGroupStateValidator<TControls extends GroupStateControls> = GroupStateValidator<
  TControls,
  { [key in keyof TControls]: any }
>;
