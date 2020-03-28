import {
  Directive,
  ElementRef,
  Inject,
  Optional,
  Renderer2
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { circularDeepEqual } from 'fast-equals';
import { CONFIG_TOKEN } from '../../config';
import { FormsConfig } from '../../types';
import {
  AbstractControlDirective,
  CONTROL_DIRECTIVE_SELECTOR
} from './abstract-control.directive';

@Directive({
  selector: `[${CONTROL_DIRECTIVE_SELECTOR}]`
})
export class ValueAccessorConnectorDirective extends AbstractControlDirective<
  any
> {
  public accessor: ControlValueAccessor;
  public lastValue: any;

  constructor(
    ref: ElementRef,
    r2: Renderer2,
    @Inject(CONFIG_TOKEN) config: FormsConfig,
    @Optional()
    @Inject(NG_VALUE_ACCESSOR)
    accessors: ControlValueAccessor[]
  ) {
    super(ref, r2, config);
    this.initAccessor(accessors);
  }

  public initAccessor(accessors: ControlValueAccessor[]) {
    if (!accessors || !accessors.length) {
      return;
    }

    this.accessor = accessors[0];
    this.accessor.registerOnChange(val => super.emitValue(val));
    this.accessor.registerOnTouched(() => super.emitTouched());
  }

  public setValue(value: any) {
    if (!this.accessor) {
      return;
    }

    if (this.config$.value.distinctWritesOnly && this.equalsLastValue(value)) {
      return;
    }

    this.accessor.writeValue(value);
  }

  public setDisabled(disabled: boolean) {
    if (this.accessor && this.accessor.setDisabledState) {
      this.accessor.setDisabledState(disabled);
    }
  }

  public equalsLastValue(value: any) {
    const result = circularDeepEqual(value, this.lastValue);

    if (!result) {
      this.lastValue = value;
    }

    return result;
  }
}
