import { Directive } from '@angular/core';
import {
  FormControlUpdate,
  FormGroupSummary,
  FormGroupUpdate
} from '../../logic/control/init/types';
import { AbstractFormDirective } from './abstract-form.directive';

@Directive({
  selector: '[cinderGroup]'
})
export class FormGroupDirective extends AbstractFormDirective<
  FormGroupSummary<any>,
  FormGroupUpdate<any>
> {
  public emitUpdate(update: FormControlUpdate<any, any>, key: string) {
    this.formUpdate.next({ controls: { [key]: update } });
  }
}
