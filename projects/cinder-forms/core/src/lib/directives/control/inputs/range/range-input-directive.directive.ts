import { Directive } from '@angular/core';
import { CINDER_CONTROL_DIRECTIVE_SELECTOR } from '../../cinder-control.directive';
import { NumberInputDirectiveDirective } from '../number/number-input-directive.directive';

@Directive({
  selector: `input[type="range"][${CINDER_CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class RangeInputDirectiveDirective extends NumberInputDirectiveDirective {}
