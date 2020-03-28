import { ComponentFixture, TestBed } from '@angular/core/testing';
import { first, take } from 'rxjs/operators';

import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { CinderFormsModule } from '../../cinder-forms.module';
import { initFormGroup } from '../../init';
import { getFormGroupSummary } from '../../selectors';
import { FormGroupSummary } from '../../types';
import { TextInputControlDirective } from '../controls/text-input-control.directive';
import { FormGroupUpdate } from './../../types';
import { FormGroupDirective } from './form-group.directive';

@Component({
  template: `
    <div cinderGroup [formSummary]="formSummary$ | async" (formUpdate)="update($event)">
      <input *ngIf="showInput" cinderControl="control" />
    </div>
  `
})
class TestComponent {
  public formSummary$: ReplaySubject<FormGroupSummary<{ control: string }>>;
  public update: (update) => void;
  public showInput = true;
}

describe('FormGroupDirective', () => {
  let directive: FormGroupDirective;
  let textInputDirective: TextInputControlDirective;
  let testComponent: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CinderFormsModule],
      declarations: [TestComponent]
    });

    testComponent = TestBed.createComponent(TestComponent);
    testComponent.componentInstance.formSummary$ = new ReplaySubject(1, undefined);
    testComponent.componentInstance.update = () => {};

    testComponent.detectChanges();

    directive = testComponent.debugElement
      .query(By.directive(FormGroupDirective))
      .injector.get(FormGroupDirective);

    textInputDirective = testComponent.debugElement
      .query(By.directive(TextInputControlDirective))
      .injector.get(TextInputControlDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should not crash without children', () => {
    expect(async () => {
      testComponent.componentInstance.showInput = false;
      testComponent.detectChanges();

      testComponent.componentInstance.formSummary$.next(
        getFormGroupSummary(initFormGroup({ control: [''] }))
      );

      // tslint:disable-next-line: no-string-literal
      const children = await directive['getChildren']()
        .pipe(first())
        .toPromise();

      expect(children.length).toEqual(0);
    }).not.toThrow();
  });

  it('should propagate update to child', () => {
    const value = 'value';
    const spy = spyOn(textInputDirective, 'setValue');

    testComponent.componentInstance.formSummary$.next(
      getFormGroupSummary(initFormGroup({ control: [value] }))
    );

    testComponent.detectChanges();

    expect(spy).toHaveBeenCalledWith(value);
  });

  it('should propagate child event', async () => {
    const value = 'value';

    textInputDirective.emitValue(value);

    const update = await directive.formUpdate.pipe(take(1)).toPromise();

    expect(update).toEqual({
      controls: {
        control: {
          value,
          pristine: false
        }
      }
    } as FormGroupUpdate<{ control: string }>);
  });
});
