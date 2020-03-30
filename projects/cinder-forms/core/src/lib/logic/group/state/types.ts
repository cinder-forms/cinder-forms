import { initFormControl } from '../../../init';
import { FormControlErrors, FormControlState, UnknownValidators } from '../../../types';

export interface GroupStateControls {
  [key: string]: FormControlState<any, any>;
}

// Builder Functions
export type GroupBuilder<RStateControls extends GroupStateControls> = (
  init: typeof initFormControl
) => RStateControls;

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
