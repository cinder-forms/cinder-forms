import { Directive, Input } from '@angular/core';
import { BehaviorSubject, NEVER } from 'rxjs';
import { exhaustMap, map, distinctUntilChanged } from 'rxjs/operators';
import { CinderControlState } from '../../logic/control/init/types';
import { toUpdate } from '../../logic/utils/types';
import { connectControl } from './../../connector/control/connect';
import { circularDeepEqual } from 'fast-equals';

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
    this.subscribeToControls();
  }

  @Input('cinderControl')
  public set setCinderControl(controlConnector: TControlConnector) {
    this.connector$.next(controlConnector);
  }

  private update(update: TControlUpdate) {
    this.connector$.value.update(update);
  }

  private setDirty(dirty: boolean) {}

  private setTouched(touched: boolean) {}

  private setInvalid(invalid: boolean) {}

  private setChanged(changed: boolean) {}

  private setValue(value: any) {}

  private subscribeToControls() {
    this.control$
      .pipe(
        map((control) => control.dirty),
        distinctUntilChanged()
      )
      .subscribe((dirty) => this.setDirty(dirty));

    this.control$
      .pipe(
        map((control) => control.touched),
        distinctUntilChanged()
      )
      .subscribe((touched) => this.setTouched(touched));

    this.control$
      .pipe(
        map((control) => control.invalid),
        distinctUntilChanged()
      )
      .subscribe((invalid) => this.setInvalid(invalid));

    this.control$
      .pipe(
        map((control) => control.changed),
        distinctUntilChanged()
      )
      .subscribe((changed) => this.setChanged(changed));

    this.control$
      .pipe(
        map((control) => control.value),
        distinctUntilChanged((val1, val2) => circularDeepEqual(val1, val2))
      )
      .subscribe((value) => this.setValue(value));
  }
}
