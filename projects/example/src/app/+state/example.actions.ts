import { createAction, props } from '@ngrx/store';
import { SimpleControlUpdate, SimpleGroupUpdate } from './example.reducer';

export const updateSimpleControl = createAction(
  'Update SimpleControl',
  props<{ update: SimpleControlUpdate }>()
);

export const updateSimpleGroup = createAction(
  'Update UpdateSimpleGroup',
  props<{
    update: SimpleGroupUpdate;
  }>()
);
