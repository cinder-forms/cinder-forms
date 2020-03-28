import { Directive, ElementRef, HostListener, Inject, Renderer2 } from '@angular/core';
import { CONFIG_TOKEN } from '../../config';
import { FormsConfig } from '../../types';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';
@Directive({
  selector: `input[type="range"][${CONTROL_DIRECTIVE_SELECTOR}]`
})
export class RangeInputControlDirective extends AbstractControlDirective<number | null> {
  constructor(ref: ElementRef, r2: Renderer2, @Inject(CONFIG_TOKEN) config: FormsConfig) {
    super(ref, r2, config);
  }

  @HostListener('input', ['$event']) public onInput($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.emitValue(value === '' ? null : parseFloat(value));
  }

  @HostListener('blur') public onBlur() {
    this.emitTouched();
  }

  public setValue(value: number) {
    this.r2.setProperty(this.ref.nativeElement, 'value', value);
  }

  public setDisabled(disabled: boolean) {
    this.r2.setProperty(this.ref.nativeElement, 'disabled', disabled);
  }
}
