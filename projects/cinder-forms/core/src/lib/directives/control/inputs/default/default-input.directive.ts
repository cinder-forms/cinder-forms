import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import {
  CINDER_CONTROL_DIRECTIVE_SELECTOR,
  CinderControlDirective,
} from '../../cinder-control.directive';

@Directive({
  selector: `input[type="text"][${CINDER_CONTROL_DIRECTIVE_SELECTOR}],textarea[${CINDER_CONTROL_DIRECTIVE_SELECTOR}],input:not([type="checkbox"]):not([type="number"]):not([type="range"]):not([type="radio"])[${CINDER_CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class DefaultInputDirective<T = string> extends CinderControlDirective {
  constructor(ref: ElementRef, r2: Renderer2) {
    super(ref, r2);
  }

  protected setDirty(dirty: boolean) {}
  protected setTouched(touched: boolean) {}
  protected setInvalid(invalid: boolean) {}
  protected setChanged(changed: boolean) {}

  protected setValue(value: T) {
    if (value === this.ref.nativeElement.value) {
      return;
    }

    this.r2.setProperty(this.ref.nativeElement, 'value', value);
  }

  protected setDisabled(disabled: boolean) {
    this.r2.setProperty(this.ref.nativeElement, 'disabled', disabled);
  }

  @HostListener('input', ['$event'])
  protected onInput($event: Event) {
    const value = ($event.target as HTMLInputElement).value;

    super.update({
      value,
    });
  }

  @HostListener('blur')
  private onBlur() {
    super.update({
      touched: true,
    });
  }
}
