import { Observable } from 'rxjs';
import { CinderControlUpdate, UnknownValidators } from '../../logic/control/init/types';
import { CinderControl } from '../../logic/control/types';

export interface CinderControlConnector<
  T extends any,
  TValidators extends UnknownValidators<T> = UnknownValidators<T>
> extends CinderControl<T, TValidators> {
  update: (update: CinderControlUpdate<T, TValidators>) => void;
  control$: Observable<CinderControl<T, TValidators>>;
}
