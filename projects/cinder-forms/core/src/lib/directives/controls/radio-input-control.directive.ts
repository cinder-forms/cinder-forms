import { Directive, ElementRef, HostListener, Inject, Renderer2 } from '@angular/core';
import { CONFIG_TOKEN } from '../../config';
import { CinderConfig } from '../../logic/control/init/types';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';

export const RadioControlNotSupported = Error(
  // tslint:disable-next-line: max-line-length
  `Radio inputs are not yet supported. If you need to use one consider wrapping it in a Component which implements the ControlValueAccessor interface.`
);

@Directive({
  selector: `input[type="radio"][${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class RadioInputControlDirective extends AbstractControlDirective<boolean> {
  constructor(ref: ElementRef, r2: Renderer2, @Inject(CONFIG_TOKEN) config: CinderConfig) {
    super(ref, r2, config);

    throw RadioControlNotSupported;
  }

  public setValue(value: boolean) {
    throw RadioControlNotSupported;
  }
}
