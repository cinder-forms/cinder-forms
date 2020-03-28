import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControlSummary, FormsConfig } from '../../types';

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
  public summary$: ReplaySubject<FormControlSummary<string>>;
  public update: () => {};
}

describe('AbstractControlDirective', () => {
  const moduleFormsConfig: FormsConfig = {
    distinctWritesOnly: true,
    throttleTime: 111111111111
  };

  let testComponent: ComponentFixture<TestComponent>;

  let directiveDebug: DebugElement;
  let directive: TextInputControlDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CinderFormsModule.withConfig(moduleFormsConfig)],
      declarations: [TestComponent]
    });

    testComponent = TestBed.createComponent(TestComponent);
    testComponent.componentInstance.summary$ = new ReplaySubject(1);
    testComponent.componentInstance.update = () => ({});

    testComponent.detectChanges();

    directiveDebug = testComponent.debugElement.query(By.directive(TextInputControlDirective));

    directive = directiveDebug.injector.get(TextInputControlDirective);
  });

  describe('cssClasses', () => {
    [
      [{ dirty: false }, 'ng-pristine', 'ng-dirty'],
      [{ dirty: true }, 'ng-dirty', 'ng-pristine'],
      [{ invalid: true }, 'ng-invalid', 'ng-valid'],
      [{ invalid: false }, 'ng-valid', 'ng-invalid'],
      [{ touched: false }, 'ng-untouched', 'ng-touched'],
      [{ touched: true }, 'ng-touched', 'ng-untouched'],
      [{ changed: true }, 'ng-changed', 'ng-initial'],
      [{ changed: false }, 'ng-initial', 'ng-changed']
    ].forEach(([update, shouldSet, shouldUnset]) => {
      it(`${update} should set ${shouldSet} and unset ${shouldUnset}`, () => {
        testComponent.componentInstance.summary$.next({
          ...getFormControlSummary(initFormControl([''])),
          ...(update as Partial<FormControlSummary<any>>)
        });

        testComponent.detectChanges();

        // tslint:disable-next-line: no-string-literal
        const isPristine = directive['ref'].nativeElement.classList.contains(shouldSet);
        // tslint:disable-next-line: no-string-literal
        const isDirty = directive['ref'].nativeElement.classList.contains(shouldUnset);

        expect(isPristine).toEqual(true);
        expect(isDirty).toEqual(false);
      });
    });
  });

  describe('config', () => {
    it('subject should have the default module config', () => {
      // tslint:disable-next-line
      const config$ = directive['config$'];
      expect(config$.value).toEqual(moduleFormsConfig);
    });

    it('setConfig should override module config', () => {
      const config: FormsConfig = {
        distinctWritesOnly: false,
        throttleTime: 2222222
      };

      directive.setConfig = config;

      // tslint:disable-next-line
      const config$ = directive['config$'];
      expect(config$.value).toEqual(config);
    });
  });
});
