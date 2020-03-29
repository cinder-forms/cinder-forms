import { FormControlErrors, FormControlState, UnknownValidators, Validator } from '../../../types';

export interface GroupStateControls {
  [key: string]: FormControlState<any, any>;
}

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
  any
>;
