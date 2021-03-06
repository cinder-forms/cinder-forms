import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControlSummary, FormControlUpdate } from '../../types';

import { By } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { CinderFormsModule } from '../../cinder-forms.module';
import { initFormControl } from '../../init';
import { getFormControlSummary } from '../../selectors';
import { NumberInputControlDirective } from './number-input-control.directive';

@Component({
  selector: 'cinder-test-component',
  template: `
    <input
      cinderControl
      type="number"
      [controlSummary]="summary$ | async"
      (controlUpdate)="update($event)"
    />
  `
})
class TestComponent {
  public summary$: ReplaySubject<FormControlSummary<number | null>>;
  public update: () => {};
}

describe('numberInputControlDirective', () => {
  let testComponent: ComponentFixture<TestComponent>;

  let directiveDebug: DebugElement;
  let directive: NumberInputControlDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CinderFormsModule],
      declarations: [TestComponent]
    });

    testComponent = TestBed.createComponent(TestComponent);
    testComponent.componentInstance.summary$ = new ReplaySubject(1);
    testComponent.componentInstance.update = () => ({});

    testComponent.detectChanges();

    directiveDebug = testComponent.debugElement.query(By.directive(NumberInputControlDirective));

    directive = directiveDebug.injector.get(NumberInputControlDirective);
  });

  it('value update propagates to child (5)', () => {
    testComponent.componentInstance.summary$.next(getFormControlSummary(initFormControl([5])));
    testComponent.detectChanges();

    // tslint:disable-next-line: no-string-literal
    const result = directive['ref'].nativeElement.value;

    expect(result).toEqual('5');
  });

  it('null value update propagates to child as empty string', () => {
    testComponent.componentInstance.summary$.next(getFormControlSummary(initFormControl([null])));
    testComponent.detectChanges();

    // tslint:disable-next-line: no-string-literal
    const result = directive['ref'].nativeElement.value;

    expect(result).toEqual('');
  });

  it('disabled update propagates to child (true)', () => {
    testComponent.componentInstance.summary$.next(
      getFormControlSummary(initFormControl({ value: 5, disabled: true }))
    );
    testComponent.detectChanges();

    // tslint:disable-next-line: no-string-literal
    const result = directive['ref'].nativeElement.disabled;

    expect(result).toEqual(true);
  });

  it('disabled update propagates to child (false)', () => {
    testComponent.componentInstance.summary$.next(
      getFormControlSummary(initFormControl({ value: 5, disabled: false }))
    );
    testComponent.detectChanges();

    // tslint:disable-next-line: no-string-literal
    const result = directive['ref'].nativeElement.disabled;

    expect(result).toEqual(false);
  });

  it('value update propagates from child', done => {
    const value = 5;

    const expected: FormControlUpdate<number> = {
      value,
      dirty: true
    };

    directive.controlUpdate.subscribe(result => {
      expect(result).toEqual(expected);
      done();
    });

    directive.onInput({
      target: {
        value
      }
    } as any);
  });

  it('empty value update propagates from child as null', done => {
    const value = '';

    const expected: FormControlUpdate<number | null> = {
      value: null,
      dirty: true
    };

    directive.controlUpdate.subscribe(result => {
      expect(result).toEqual(expected);
      done();
    });

    directive.onInput({
      target: {
        value
      }
    } as any);
  });

  it('touched update propagates from child', done => {
    const expected: FormControlUpdate<number> = {
      touched: true
    };

    directive.controlUpdate.subscribe(result => {
      expect(result).toEqual(expected);
      done();
    });

    directive.onBlur();
  });
});
