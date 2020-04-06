import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  GroupErrors,
  GroupStateControls,
  UnkownGroupStateValidator,
} from '../../logic/group/state/types';
import { CinderGroupUpdate, toGroupUpdateControls } from '../../logic/group/update/types';
import { mapGroupControls } from '../../logic/group/utils/map';
import { NO_GROUP_ERROR } from '../../logic/group/validator/validator';
import { CinderControlConnector, connectControl } from '../control/connect';
import { CinderControlState } from './../../logic/control/init/types';
import { CinderGroup } from './../../logic/group/types';
import { initGroup, toUpdate } from '../../../public-api';
import { reduceGroupState } from '../../logic/group/update/reduce';
import { selectGroup } from '../../logic/group/select';

export const connectGroup = <
  TStateControls extends GroupStateControls,
  TGroupValidators extends UnkownGroupStateValidator<TStateControls>[],
  TAdditionalErrors extends GroupErrors = typeof NO_GROUP_ERROR
>(
  update: (update: CinderGroupUpdate<TStateControls, TGroupValidators>) => void,
  group$: Observable<CinderGroup<TStateControls, TGroupValidators, TAdditionalErrors>>
) => new CinderGroupConnector<TStateControls, TGroupValidators, TAdditionalErrors>(update, group$);

export class CinderGroupConnector<
  TStateControls extends GroupStateControls,
  TGroupValidators extends UnkownGroupStateValidator<TStateControls>[],
  TAdditionalErrors extends GroupErrors = typeof NO_GROUP_ERROR
> implements Omit<CinderGroup<TStateControls, TGroupValidators, TAdditionalErrors>, 'controls'> {
  private state$ = new BehaviorSubject<
    CinderGroup<TStateControls, TGroupValidators, TAdditionalErrors> | undefined
  >(undefined);

  constructor(
    public update: (update: CinderGroupUpdate<TStateControls, TGroupValidators>) => void,
    public group$: Observable<CinderGroup<TStateControls, TGroupValidators, TAdditionalErrors>>
  ) {
    group$.subscribe(this.state$);
  }

  get controls() {
    return mapGroupControls(this.state$.value?.controls!, (control, key) =>
      connectControl(
        (update) =>
          this.update({
            controls: {
              [key]: update,
            } as toGroupUpdateControls<TStateControls>,
          }),
        this.state$.pipe(map((group) => group?.controls![key]))
      )
    ) as {
      [K in keyof TStateControls]: TStateControls[K] extends CinderControlState<
        infer T,
        infer TValidators
      >
        ? CinderControlConnector<T, TValidators>
        : never;
    };
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
    return (
      this.state$.value?.errors ||
      ({} as CinderGroup<TStateControls, TGroupValidators, TAdditionalErrors>['errors'])
    );
  }

  public get validators() {
    return this.state$.value?.validators || (([] as unknown) as TGroupValidators);
  }
}
