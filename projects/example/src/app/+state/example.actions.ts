import { FormArrayUpdate, FormControlUpdate, FormGroupUpdate } from '@cinder-forms/core';
import { createAction, props } from '@ngrx/store';
import { ExampleGroupControls, StateAccessExampleFormControls } from './example.reducer';

export const increment = createAction('[Counter Component] Increment');
export const updateSingleFormControl = createAction(
  '[Example] Update Single Control',
  props<{ update: FormControlUpdate<string> }>()
);

export const updateFormGroup = createAction(
  '[FormGroup] Update Form Group',
  props<{ update: FormGroupUpdate<ExampleGroupControls> }>()
);

export const resetFormGroup = createAction('[FormGroup] Reset Form Group');

export const updateFormArray = createAction(
  '[FormArray] Update Form Array',
  props<{ update: FormArrayUpdate<string> }>()
);

export const addControlToArray = createAction('[FormArray] Add Control');

export const updateStateAccessExampleFormGroup = createAction(
  '[StateAccess] Update State Access Example Form Group',
  props<{ update: FormGroupUpdate<StateAccessExampleFormControls> }>()
);
