import { Directive } from '@angular/core';
import { FormControlUpdate, FormGroupSummary, FormGroupUpdate } from '../../types';
import { AbstractFormDirective } from './abstract-form.directive';

@Directive({
  selector: '[cinderGroup]'
})
export class FormGroupDirective extends AbstractFormDirective<
  FormGroupSummary<any>,
  FormGroupUpdate<any>
> {
  public emitUpdate(update: FormControlUpdate<any>, key: string) {
    this.formUpdate.next({ controls: { [key]: update } });
  }
}
