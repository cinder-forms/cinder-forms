import { Directive, HostListener } from '@angular/core';
import { DefaultInputDirective } from '../default/default-input.directive';
import { CINDER_CONTROL_DIRECTIVE_SELECTOR } from '../../cinder-control.directive';

@Directive({
  selector: `input[type="number"][${CINDER_CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class NumberInputDirectiveDirective extends DefaultInputDirective {
  protected setValue(value: number) {
    const safeValue = value === null ? '' : value;
    super.setValue(safeValue);
  }

  protected onInput($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    const safeValue = value === '' ? null : parseFloat(value);

    super.update({
      value: safeValue,
    });
  }
}
