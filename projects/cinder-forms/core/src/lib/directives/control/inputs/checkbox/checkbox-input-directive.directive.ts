import { Directive } from '@angular/core';
import { CINDER_CONTROL_DIRECTIVE_SELECTOR } from '../../cinder-control.directive';
import { DefaultInputDirective } from '../default/default-input.directive';

@Directive({
  selector: `input[type="checkbox"][${CINDER_CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class CheckboxInputDirectiveDirective extends DefaultInputDirective<boolean> {
  protected setValue(value: boolean) {
    this.r2.setProperty(this.ref.nativeElement, 'checked', value);
  }

  protected onInput($event: Event) {
    const value = ($event.target as HTMLInputElement).checked;
    super.update({
      value,
    });
  }
}
