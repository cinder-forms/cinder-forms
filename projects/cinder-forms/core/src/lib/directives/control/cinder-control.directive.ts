import { Directive, Input } from '@angular/core';
import { BehaviorSubject, NEVER } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { CinderControlState } from '../../logic/control/init/types';
import { toUpdate } from '../../logic/utils/types';
import { connectControl } from './../../connector/control/connect';

type TControlState = CinderControlState<{}, any>;
type TControlUpdate = toUpdate<TControlState>;

const EmptyConnector = connectControl<TControlState>(() => {}, NEVER);

type TControlConnector = typeof EmptyConnector;

@Directive({
  selector: '[cinderControl]',
})
export class CinderControlDirective {
  private readonly connector$ = new BehaviorSubject(EmptyConnector);
  private readonly control$ = this.connector$.pipe(exhaustMap((connector) => connector.control$));

  constructor() {
    this.control$.subscribe(console.log);
  }

  @Input('cinderControl')
  public set setCinderControl(controlConnector: TControlConnector) {
    this.connector$.next(controlConnector);
  }

  private update(update: TControlUpdate) {
    this.connector$.value.update(update);
  }
}
