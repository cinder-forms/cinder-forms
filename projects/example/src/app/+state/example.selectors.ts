import {
  FormGroupErrors,
  getFormArraySummary,
  getFormControlSummary,
  getFormGroupSummary
} from '@cinder-forms/core';

import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';
import { StateAccessExampleFormControls } from './example.reducer';

export const selectExample = (state: AppState) => state.example;

export const selectSingleInput = createSelector(selectExample, state =>
  getFormControlSummary(state.singleControl)
);

export const selectFormGroup = createSelector(selectExample, state =>
  getFormGroupSummary(state.group)
);

export const selectForbiddenNumber = createSelector(selectExample, state => state.forbiddenNumber);

export const selectForbiddenNumberError = createSelector(
  selectExample,
  (state): FormGroupErrors<StateAccessExampleFormControls> =>
    state.forbiddenNumber === state.stateAccessExampleGroup.controls.exampleInput.value
      ? {
          exampleInput: {
            externalNumberError: true
          }
        }
      : {}
);

export const selectStateAccessExampleGroup = createSelector(
  selectExample,
  selectForbiddenNumberError,
  (state, forbiddenNumberError) =>
    getFormGroupSummary(state.stateAccessExampleGroup, forbiddenNumberError)
);

export const selectArray = createSelector(selectExample, state => getFormArraySummary(state.array));
