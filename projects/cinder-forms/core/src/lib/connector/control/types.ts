import { Observable } from 'rxjs';
import { CinderControlState } from '../../logic/control/init/types';
import { toSelected, toUpdate } from '../../logic/utils/types';

export interface CinderControlConnector<TControlState extends CinderControlState<any, any>> {
  update: (update: toUpdate<TControlState>) => void;
  control$: Observable<toSelected<TControlState>>;
}
