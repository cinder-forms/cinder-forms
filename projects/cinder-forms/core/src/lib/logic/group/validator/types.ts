import { FormControlErrors } from '../../../types';
import { GroupStateControls } from '../state/types';

export type toGroupErrors<TControls extends GroupStateControls> = {
  [K in keyof TControls]: FormControlErrors;
};
