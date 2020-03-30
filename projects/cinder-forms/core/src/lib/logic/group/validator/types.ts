import { FormControlErrors } from '../../control/init/types';
import { GroupStateControls } from '../state/types';

export type toGroupErrors<TControls extends GroupStateControls> = {
  [K in keyof TControls]: FormControlErrors;
};
