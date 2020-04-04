import {} from '@cinder-forms/core';
import { createAction, props } from '@ngrx/store';
import { SimpleControlUpdate } from './example.reducer';

export const updateSimpleControl = createAction(
  'Update SimpleControl',
  props<{ update: SimpleControlUpdate }>()
);
