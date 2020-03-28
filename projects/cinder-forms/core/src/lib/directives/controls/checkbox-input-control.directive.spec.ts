import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControlSummary, FormControlUpdate } from '../../types';

import { By } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { CinderFormsModule } from '../../cinder-forms.module';
import { initFormControl } from '../../init';
import { getFormControlSummary } from '../../selectors';
import { CheckboxInputControlDirective } from './checkbox-input-control.directive';

@Component({
  selector: 'cinder-test-component',
  template: `
    <input
      cinderControl
      type="checkbox"
      [controlSummary]="summary$ | async"
      (controlUpdate)="update($event)"
    />
  `
})
class TestComponent {
  public summary$: ReplaySubject<FormControlSummary<boolean>>;
  public update: () => {};
}

describe('checkboxInputControlDirective', () => {
  let testComponent: ComponentFixture<TestComponent>;

  let directiveDebug: DebugElement;
  let directive: CheckboxInputControlDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CinderFormsModule],
      declarations: [TestComponent]
    });

    testComponent = TestBed.createComponent(TestComponent);
    testComponent.componentInstance.summary$ = new ReplaySubject(1);
    testComponent.componentInstance.update = () => ({});

    testComponent.detectChanges();

    directiveDebug = testComponent.debugElement.query(By.directive(CheckboxInputControlDirective));

    directive = directiveDebug.injector.get(CheckboxInputControlDirective);
  });
  it('value update propagates to child (true)', () => {
    testComponent.componentInstance.summary$.next(getFormControlSummary(initFormControl([true])));

    testComponent.detectChanges();

    // tslint:disable-next-line: no-string-literal
    const result = directive['ref'].nativeElement.checked;

    expect(result).toEqual(true);
  });

  it('value update propagates to child (false)', () => {
    testComponent.componentInstance.summary$.next(getFormControlSummary(initFormControl([false])));

    testComponent.detectChanges();

    // tslint:disable-next-line: no-string-literal
    const result = directive['ref'].nativeElement.checked;

    expect(result).toEqual(false);
  });

  it('disabled update propagates to child (true)', () => {
    testComponent.componentInstance.summary$.next(
      getFormControlSummary(initFormControl({ value: true, disabled: true }))
    );

    testComponent.detectChanges();

    // tslint:disable-next-line: no-string-literal
    const result = directive['ref'].nativeElement.disabled;

    expect(result).toEqual(true);
  });

  it('disabled update propagates to child (false)', () => {
    testComponent.componentInstance.summary$.next(
      getFormControlSummary(initFormControl({ value: true, disabled: false }))
    );

    testComponent.detectChanges();

    // tslint:disable-next-line: no-string-literal
    const result = directive['ref'].nativeElement.disabled;

    expect(result).toEqual(false);
  });

  it('value update propagates from child', done => {
    const value = true;

    const expected: FormControlUpdate<boolean> = {
      value,
      dirty: true
    };

    directive.controlUpdate.subscribe(result => {
      expect(result).toEqual(expected);
      done();
    });

    directive.onInput({
      target: {
        checked: value
      }
    } as any);
  });

  it('touched update propagates from child', done => {
    const expected: FormControlUpdate<boolean> = {
      touched: true
    };

    directive.controlUpdate.subscribe(result => {
      expect(result).toEqual(expected);
      done();
    });

    directive.onBlur();
  });
});
