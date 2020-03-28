import {
  AfterViewInit,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import { combineLatest, merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import {
  FormArraySummary,
  FormArrayUpdate,
  FormControlUpdate,
  FormGroupSummary,
  FormGroupUpdate
} from '../../types';
import { AbstractControlDirective } from '../controls/abstract-control.directive';
import { ControlChildren } from './control-children';

type FormSummary = FormGroupSummary<any> | FormArraySummary<any>;
type FormUpdate = FormGroupUpdate<any> | FormArrayUpdate<any>;

export abstract class AbstractFormDirective<
  Summary extends FormSummary,
  Update extends FormUpdate
> extends ControlChildren implements AfterViewInit, OnDestroy {
  @Input('formSummary')
  set setFormSummary(summary: Summary) {
    if (!summary) {
      return;
    }

    this.formSummary$.next(summary);
  }

  @Output() public formUpdate = new EventEmitter<Update>();

  public formSummary$ = new ReplaySubject<FormSummary>(1);

  public ngAfterViewInit() {
    const children$ = this.getChildren();

    children$
      .pipe(
        map(children =>
          children.map(child =>
            child.controlUpdate.pipe(
              filter(() => child.controlKey !== undefined),
              map((update): [typeof update, string] => [
                update,
                child.controlKey!
              ])
            )
          )
        ),
        switchMap(children => merge(...children))
      )
      .subscribe(([update, key]) => this.emitUpdate(update, key));

    combineLatest(
      children$,
      this.formSummary$
    ).subscribe(([children, summary]) =>
      this.updateChildren(children, summary)
    );
  }

  public ngOnDestroy() {
    this.formSummary$.complete();
  }

  public updateChildren(
    children: AbstractControlDirective<any>[],
    summary: FormSummary
  ) {
    if (!children.length) {
      return;
    }

    children
      .filter(control => control.controlKey !== undefined)
      .forEach(control => {
        control.updateSummary(summary.controls[control.controlKey!]);
      });
  }

  public abstract emitUpdate(update: FormControlUpdate<any>, key: string);
}
