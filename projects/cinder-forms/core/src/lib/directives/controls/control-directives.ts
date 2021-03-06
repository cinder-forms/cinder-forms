import { Type } from '@angular/core';
import { AbstractControlDirective } from './abstract-control.directive';
import { CheckboxInputControlDirective } from './checkbox-input-control.directive';
import { NumberInputControlDirective } from './number-input-control.directive';
import { RadioInputControlDirective } from './radio-input-control.directive';
import { RangeInputControlDirective } from './range-input-control.directive';
import { SelectInputControlDirective } from './select-input-control.directive';
import { TextInputControlDirective } from './text-input-control.directive';
import { ValueAccessorConnectorDirective } from './value-accessor-connector.directive';

export const controlDirectives: Type<AbstractControlDirective<any>>[] = [
  TextInputControlDirective,
  CheckboxInputControlDirective,
  NumberInputControlDirective,
  RadioInputControlDirective,
  RangeInputControlDirective,
  SelectInputControlDirective,
  ValueAccessorConnectorDirective
];
