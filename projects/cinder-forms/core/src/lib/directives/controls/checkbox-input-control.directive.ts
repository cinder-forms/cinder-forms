import { Directive, ElementRef, HostListener, Inject, Renderer2 } from '@angular/core';
import { CONFIG_TOKEN } from '../../config';
import { FormsConfig } from '../../types';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';

@Directive({
  selector: `input[type="checkbox"][${CONTROL_DIRECTIVE_SELECTOR}]`
})
export class CheckboxInputControlDirective extends AbstractControlDirective<boolean> {
  constructor(ref: ElementRef, r2: Renderer2, @Inject(CONFIG_TOKEN) config: FormsConfig) {
    super(ref, r2, config);
  }

  @HostListener('input', ['$event']) public onInput($event: Event) {
    const checked = ($event.target as HTMLInputElement).checked;
    this.emitValue(checked);
  }

  @HostListener('blur') public onBlur() {
    this.emitTouched();
  }

  public setValue(value: boolean) {
    this.r2.setProperty(this.ref.nativeElement, 'checked', value);
  }

  public setDisabled(disabled: boolean) {
    this.r2.setProperty(this.ref.nativeElement, 'disabled', disabled);
  }
}
