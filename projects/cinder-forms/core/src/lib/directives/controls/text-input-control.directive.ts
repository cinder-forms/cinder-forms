import { Directive, ElementRef, HostListener, Inject, Renderer2 } from '@angular/core';
import { CONFIG_TOKEN } from '../../config';
import { CinderConfig } from '../../logic/control/init/types';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';

@Directive({
  // tslint:disable-next-line: max-line-length
  selector: `input[type="text"][${CONTROL_DIRECTIVE_SELECTOR}],textarea[${CONTROL_DIRECTIVE_SELECTOR}],input:not([type="checkbox"]):not([type="number"]):not([type="range"]):not([type="radio"])[${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class TextInputControlDirective extends AbstractControlDirective<string> {
  constructor(ref: ElementRef, r2: Renderer2, @Inject(CONFIG_TOKEN) config: CinderConfig) {
    super(ref, r2, config);
  }

  @HostListener('input', ['$event']) public onInput($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.emitValue(value);
  }

  @HostListener('blur') public onBlur() {
    this.emitTouched();
  }

  public setValue(value: string) {
    this.r2.setProperty(this.ref.nativeElement, 'value', value);
  }

  public setDisabled(disabled: boolean) {
    this.r2.setProperty(this.ref.nativeElement, 'disabled', disabled);
  }
}
