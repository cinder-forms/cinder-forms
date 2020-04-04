import { Directive, ElementRef, HostListener, Renderer2, Inject } from '@angular/core';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';
import { CONFIG_TOKEN } from '../../config';
import { CinderConfig } from '../../logic/control/init/types';

export const SelectControlNotSupported = Error(
  // tslint:disable-next-line: max-line-length
  `Select inputs are not yet supported. If you need to use one consider wrapping it in a Component which implements the ControlValueAccessor interface.`
);

@Directive({
  selector: `select[${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class SelectInputControlDirective extends AbstractControlDirective<boolean> {
  constructor(ref: ElementRef, r2: Renderer2, @Inject(CONFIG_TOKEN) config: CinderConfig) {
    super(ref, r2, config);

    throw SelectControlNotSupported;
  }

  public setValue(value: boolean) {
    throw SelectControlNotSupported;
  }
}
