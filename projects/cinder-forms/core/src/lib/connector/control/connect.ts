import { ValidatorsToErrors } from './../../logic/control/types';
import { BehaviorSubject, Observable } from 'rxjs';
import { CinderControl } from '../../../public-api';
import { CinderControlUpdate, UnknownValidators } from '../../logic/control/init/types';

export const connectControl = <
  T extends any,
  TValidators extends UnknownValidators<T> = UnknownValidators<T>
>(
  update: (update: CinderControlUpdate<T, TValidators>) => void,
  control$: Observable<CinderControl<T, TValidators>>
) => new CinderControlConnector(update, control$);

export class CinderControlConnector<
  T extends any,
  TValidators extends UnknownValidators<T> = UnknownValidators<T>
> implements CinderControl<T | undefined, TValidators> {
  private state$ = new BehaviorSubject<CinderControl<T, TValidators> | undefined>(undefined);

  constructor(
    public update: (update: CinderControlUpdate<T, TValidators>) => void,
    public control$: Observable<CinderControl<T, TValidators>>
  ) {
    control$.subscribe(this.state$);
  }

  public get value() {
    return this.state$.value?.value;
  }

  public get initialValue() {
    return this.state$.value?.initialValue;
  }

  public get dirty() {
    return this.state$.value?.dirty || false;
  }

  public get touched() {
    return this.state$.value?.touched || false;
  }

  public get changed() {
    return this.state$.value?.changed || false;
  }

  public get disabled() {
    return this.state$.value?.changed || false;
  }

  public get invalid() {
    return this.state$.value?.invalid || false;
  }

  public get errors() {
    return this.state$.value?.errors || ({} as ValidatorsToErrors<TValidators>);
  }

  public get validators() {
    return this.state$.value?.validators || (([] as unknown) as TValidators);
  }
}
