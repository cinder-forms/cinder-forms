import { Observable } from 'rxjs';
import { CinderControlState } from '../../logic/control/init/types';
import { toSelected, toUpdate } from '../../logic/utils/types';
import { CinderControlConnector } from './types';

export const connectControl = <TControlState extends CinderControlState<any, any>>(
  update: (update: toUpdate<TControlState>) => void,
  changes$: Observable<toSelected<TControlState>>
): CinderControlConnector<TControlState> => ({
  update,
  changes$,
});
