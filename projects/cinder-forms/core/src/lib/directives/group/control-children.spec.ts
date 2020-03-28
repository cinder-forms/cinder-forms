import { Component, Directive, forwardRef } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { By } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { CinderFormsModule } from '../../cinder-forms.module';
import { CheckboxInputControlDirective } from '../controls/checkbox-input-control.directive';
import { NumberInputControlDirective } from '../controls/number-input-control.directive';
import { RangeInputControlDirective } from '../controls/range-input-control.directive';
import { SelectControlNotSupported } from '../controls/select-input-control.directive';
import { TextInputControlDirective } from '../controls/text-input-control.directive';
import { RadioControlNotSupported } from './../controls/radio-input-control.directive';
import { ValueAccessorConnectorDirective } from './../controls/value-accessor-connector.directive';
import { ControlChildren } from './control-children';

@Component({
  template: '',
  selector: 'cinder-custom-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
class CustomInputComponent implements ControlValueAccessor {
  public writeValue = (obj: any) => {};
  public registerOnChange(fn: any): void {}
  public registerOnTouched(fn: any): void {}
  public setDisabledState?(isDisabled: boolean): void {}
}

describe('control-children', () => {
  it(`should support checkboxInput`, async () => {
    const childDirectives = await getChildDirectivesForComponent(`
            <input type="checkbox" cinderControl/>
        `);

    expect(childDirectives.find(d => d instanceof CheckboxInputControlDirective)).toBeDefined();
  });

  it(`should support numberInput`, async () => {
    const childDirectives = await getChildDirectivesForComponent(`
            <input type="number" cinderControl />
        `);

    expect(childDirectives.find(d => d instanceof NumberInputControlDirective)).toBeDefined();
  });

  it(`should throw RadioControlNotSupported on radioInput`, async () => {
    let error;

    try {
      const childDirectives = await getChildDirectivesForComponent(`
                <input type="radio" cinderControl />
            `);
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(RadioControlNotSupported);
  });

  it(`should support rangeInput`, async () => {
    const childDirectives = await getChildDirectivesForComponent(`
            <input type="range" cinderControl />
        `);

    expect(childDirectives.find(d => d instanceof RangeInputControlDirective)).toBeDefined();
  });

  it(`should throw SelectControlNotSupported on selectInput`, async () => {
    let error;

    try {
      const childDirectives = await getChildDirectivesForComponent(`
                <select cinderControl>
                </select>
            `);
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(SelectControlNotSupported);
  });

  it(`should support textInput`, async () => {
    const childDirectives = await getChildDirectivesForComponent(`
            <input type="text" cinderControl />
        `);

    expect(childDirectives.find(d => d instanceof TextInputControlDirective)).toBeDefined();
  });

  it(`should support default input`, async () => {
    const childDirectives = await getChildDirectivesForComponent(`
            <input cinderControl />
        `);

    expect(childDirectives.find(d => d instanceof TextInputControlDirective)).toBeDefined();
  });

  it(`should support valueAccessor`, async () => {
    const childDirectives = await getChildDirectivesForComponent(`
            <cinder-custom-input  cinderControl>
            </cinder-custom-input>
        `);

    expect(childDirectives.find(d => d instanceof ValueAccessorConnectorDirective)).toBeDefined();
  });
});

async function getChildDirectivesForComponent(childTemplate: string) {
  // tslint:disable-next-line: max-classes-per-file
  @Directive({ selector: '[cinderTestDirective]' })
  class TestDirective extends ControlChildren {
    public testGetChildren = () => this.getChildren();
  }

  // tslint:disable-next-line: max-classes-per-file
  @Component({
    providers: [TestDirective],
    template: `
      <div cinderTestDirective>
        ${childTemplate}
      </div>
    `
  })
  class TestComponent {}

  await TestBed.configureTestingModule({
    imports: [CinderFormsModule],
    declarations: [TestDirective, TestComponent, CustomInputComponent]
  }).compileComponents();

  const component = TestBed.createComponent(TestComponent);
  component.detectChanges();

  const directive: TestDirective = component.debugElement
    .query(By.directive(TestDirective))
    .injector.get(TestDirective);

  const children = await directive
    .testGetChildren()
    .pipe(first())
    .toPromise();

  return children;
}
