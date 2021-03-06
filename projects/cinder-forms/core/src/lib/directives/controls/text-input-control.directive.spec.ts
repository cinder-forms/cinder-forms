import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControlSummary, FormControlUpdate } from '../../types';

import { By } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { CinderFormsModule } from '../../cinder-forms.module';
import { initFormControl } from '../../init';
import { getFormControlSummary } from '../../selectors';
import { TextInputControlDirective } from './text-input-control.directive';

@Component({
  selector: 'cinder-test-component',
  template: `
    <input
      cinderControl
      type="text"
      [controlSummary]="summary$ | async"
      (controlUpdate)="update($event)"
    />
  `
})
class TestComponent {
  public summary$: ReplaySubject<FormControlSummary<string, any>>;
  public update: () => {};
}

describe('TextInputControlDirective', () => {
  let testComponent: ComponentFixture<TestComponent>;

  let directiveDebug: DebugElement;
  let directive: TextInputControlDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CinderFormsModule],
      declarations: [TestComponent]
    });

    testComponent = TestBed.createComponent(TestComponent);
    testComponent.componentInstance.summary$ = new ReplaySubject(1);
    testComponent.componentInstance.update = () => ({});

    testComponent.detectChanges();

    directiveDebug = testComponent.debugElement.query(By.directive(TextInputControlDirective));

    directive = directiveDebug.injector.get(TextInputControlDirective);
  });
  it('value update propagates to child (5)', () => {
    testComponent.componentInstance.summary$.next(getFormControlSummary(initFormControl(['5'])));
    testComponent.detectChanges();

    // tslint:disable-next-line: no-string-literal
    const result = directive['ref'].nativeElement.value;

    expect(result).toEqual('5');
  });

  it('disabled update propagates to child (true)', () => {
    testComponent.componentInstance.summary$.next(
      getFormControlSummary(initFormControl({ value: '5', disabled: true }))
    );
    testComponent.detectChanges();

    // tslint:disable-next-line: no-string-literal
    const result = directive['ref'].nativeElement.disabled;

    expect(result).toEqual(true);
  });

  it('disabled update propagates to child (false)', () => {
    testComponent.componentInstance.summary$.next(
      getFormControlSummary(initFormControl({ value: '5', disabled: false }))
    );
    testComponent.detectChanges();

    // tslint:disable-next-line: no-string-literal
    const result = directive['ref'].nativeElement.disabled;

    expect(result).toEqual(false);
  });

  it('value update propagates from child', done => {
    const value = '5';

    const expected: FormControlUpdate<string, any> = {
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

  it('touched update propagates from child', done => {
    const expected: FormControlUpdate<string, any> = {
      touched: true
    };

    directive.controlUpdate.subscribe(result => {
      expect(result).toEqual(expected);
      done();
    });

    directive.onBlur();
  });
});
