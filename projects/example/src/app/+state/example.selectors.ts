import { selectControl } from '@cinder-forms/core';
import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';

export const selectExample = (state: AppState) => state.example;

export const selectSimpleControl = createSelector(selectExample, (state) =>
  selectControl(state.simpleControl)
);
