import { ElementRef, Input, Renderer2 } from '@angular/core';
import { circularDeepEqual } from 'fast-equals';
import { BehaviorSubject, NEVER } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { CinderControlState } from '../../logic/control/init/types';
import { toUpdate } from '../../logic/utils/types';
import { connectControl } from './../../connector/control/connect';

type TControlState = CinderControlState<any, any>;
type TControlUpdate = toUpdate<TControlState>;

const EmptyConnector = connectControl<TControlState>(() => {}, NEVER);

type TControlConnector = typeof EmptyConnector;

const cssClasses = {
  invalid: ['ng-invalid', 'cinder-invalid'],
  valid: ['ng-valid', 'cinder-valid'],
  pristine: ['ng-pristine', 'cinder-pristine'],
  dirty: ['ng-dirty', 'cinder-dirty'],
  touched: ['ng-touched', 'cinder-touched'],
  untouched: ['ng-untouched', 'cinder-untouched'],
  changed: ['cinder-changed'],
  initial: ['cinder-initial'],
};

export const CINDER_CONTROL_DIRECTIVE_SELECTOR = '[cinderControl]';

export abstract class CinderControlDirective {
  private readonly connector$ = new BehaviorSubject(EmptyConnector);
  private readonly control$ = this.connector$.pipe(switchMap((connector) => connector.control$));

  constructor(protected ref: ElementRef, protected r2: Renderer2) {
    this.subscribeToControls();
  }

  @Input('cinderControl')
  public set setCinderControl(controlConnector: TControlConnector) {
    this.connector$.next(controlConnector);
  }

  protected update(update: TControlUpdate) {
    this.connector$.value.update(update);
  }

  protected abstract setDirty(dirty: boolean);

  protected abstract setTouched(touched: boolean);

  protected abstract setInvalid(invalid: boolean);

  protected abstract setChanged(changed: boolean);

  protected abstract setDisabled(disabled: boolean);

  protected abstract setValue(value: any);

  private subscribeToControls() {
    this.control$
      .pipe(
        map((control) => control.dirty),
        distinctUntilChanged(),
        tap((dirty) => this.chooseClass(cssClasses.pristine, cssClasses.dirty, dirty))
      )
      .subscribe((dirty) => this.setDirty(dirty));

    this.control$
      .pipe(
        map((control) => control.touched),
        distinctUntilChanged(),
        tap((touched) => this.chooseClass(cssClasses.untouched, cssClasses.touched, touched))
      )
      .subscribe((touched) => this.setTouched(touched));

    this.control$
      .pipe(
        map((control) => control.invalid),
        distinctUntilChanged(),
        tap((invalid) => this.chooseClass(cssClasses.valid, cssClasses.invalid, invalid))
      )
      .subscribe((invalid) => this.setInvalid(invalid));

    this.control$
      .pipe(
        map((control) => control.changed),
        distinctUntilChanged(),
        tap((changed) => this.chooseClass(cssClasses.initial, cssClasses.changed, changed))
      )
      .subscribe((changed) => this.setChanged(changed));

    this.control$
      .pipe(
        map((control) => control.changed),
        distinctUntilChanged(),
        tap((changed) => this.chooseClass(cssClasses.initial, cssClasses.changed, changed))
      )
      .subscribe((changed) => this.setChanged(changed));

    this.control$
      .pipe(
        map((control) => control.disabled),
        distinctUntilChanged()
      )
      .subscribe((disabled) => this.setChanged(disabled));

    this.control$
      .pipe(
        map((control) => control.value),
        distinctUntilChanged((val1, val2) => circularDeepEqual(val1, val2))
      )
      .subscribe((value) => this.setValue(value));
  }

  private chooseClass(class1: string[], class2: string[], chooseSecond: boolean) {
    const addClasses = chooseSecond ? class2 : class1;
    const removeClasses = chooseSecond ? class2 : class1;

    addClasses.forEach((cssClass) => this.r2.addClass(this.ref.nativeElement, cssClass));
    removeClasses.forEach((cssClass) => this.r2.removeClass(this.ref.nativeElement, cssClass));
  }
}
