import {
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  Renderer2,
} from '@angular/core';
import { BehaviorSubject, merge, Observable, Subject, Subscription } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import {
  FormControlSummary,
  FormControlUpdate,
  CinderConfig,
} from '../../logic/control/init/types';
import { CONFIG_TOKEN, throttle } from './../../config';

const cssClasses = {
  invalid: 'ng-invalid',
  valid: 'ng-valid',
  pristine: 'ng-pristine',
  dirty: 'ng-dirty',
  touched: 'ng-touched',
  untouched: 'ng-untouched',
  changed: 'ng-changed',
  initial: 'ng-initial',
};

export const CONTROL_DIRECTIVE_SELECTOR = `cinderControl`;

export abstract class AbstractControlDirective<T> implements OnDestroy {
  @Input('controlSummary')
  set setControlSummary(controlSummary: FormControlSummary<T, any>) {
    if (!controlSummary) {
      return;
    }

    this.updateSummary(controlSummary);
  }

  @Input('controlConfig')
  set setConfig(inputConfig: Partial<CinderConfig>) {
    const config = {
      ...this.injectedConfig,
      ...inputConfig,
    };

    this.config$.next(config);
  }

  @Input(CONTROL_DIRECTIVE_SELECTOR)
  public controlKey?: string;

  @Output() public controlUpdate = new EventEmitter<FormControlUpdate<T, any>>(true);
  protected config$ = new BehaviorSubject<CinderConfig>(this.injectedConfig);

  private touched$ = new Subject<FormControlUpdate<T, any>>();
  private value$ = new Subject<FormControlUpdate<T, any>>();

  private summarySubscription = new Subscription();

  constructor(
    protected ref: ElementRef,
    protected r2: Renderer2,
    @Inject(CONFIG_TOKEN) private injectedConfig: CinderConfig
  ) {
    this.config$
      .pipe(
        switchMap((config) =>
          merge(this.touched$.pipe(throttle(config)), this.value$.pipe(throttle(config)))
        ),
        tap((update) => this.controlUpdate.emit(update))
      )
      .subscribe();
  }

  public abstract setValue(value: T);

  public setDisabled?(disabled: boolean);

  public emitTouched() {
    this.touched$.next({ touched: true });
  }

  public emitValue(value: T) {
    this.value$.next({ value, dirty: true });
  }

  public updateSummary(summary: FormControlSummary<T, any>) {
    this.setValue(summary.value);

    if (this.setDisabled) {
      this.setDisabled(summary.disabled);
    }

    this.chooseClass(cssClasses.valid, cssClasses.invalid, summary.invalid);
    this.chooseClass(cssClasses.pristine, cssClasses.dirty, summary.dirty);
    this.chooseClass(cssClasses.untouched, cssClasses.touched, summary.touched);
    this.chooseClass(cssClasses.initial, cssClasses.changed, summary.changed);
  }

  public chooseClass(class1: string, class2: string, chooseSecond: boolean) {
    if (chooseSecond) {
      this.r2.addClass(this.ref.nativeElement, class2);
      this.r2.removeClass(this.ref.nativeElement, class1);
    } else {
      this.r2.addClass(this.ref.nativeElement, class1);
      this.r2.removeClass(this.ref.nativeElement, class2);
    }
  }

  public ngOnDestroy() {
    this.summarySubscription.unsubscribe();
    this.config$.complete();
    this.touched$.complete();
    this.value$.complete();
  }
}
