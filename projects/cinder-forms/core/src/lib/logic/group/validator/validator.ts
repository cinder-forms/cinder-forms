import {
  CinderGroupState,
  GroupStateControls,
  GroupStateValidator,
  UnkownGroupStateValidator
} from '../state/types';
import { toGroupErrors } from './types';

export function createGroupValidator<
  TStateControls extends GroupStateControls,
  TGroupState extends CinderGroupState<TStateControls, UnkownGroupStateValidator<TStateControls>[]>,
  TGroupErrors extends toGroupErrors<TGroupState['controls']>
>(
  isInvalid: (groupState: TGroupState) => boolean,
  buildError: (groupState: TGroupState) => TGroupErrors
): GroupStateValidator<TGroupState['controls'], TGroupErrors> {
  return (groupState: TGroupState) => (isInvalid(groupState) ? buildError(groupState) : {});
}

export const NO_GROUP_ERROR = {} as { [key: string]: {} };
