import { Validators } from '@angular/forms';
import { initControlState, toUpdate, reduceControlState } from '@cinder-forms/core';
import { createReducer, on } from '@ngrx/store';
import * as ExampleActions from './example.actions';

const intialSimpleControl = initControlState(['test']);

export type SimpleControlState = typeof intialSimpleControl;
export type SimpleControlUpdate = toUpdate<SimpleControlState>;

export const initialState: ExampleState = {
  simpleControl: intialSimpleControl,
};

export interface ExampleState {
  simpleControl: SimpleControlState;
}

const internalExampleReducer = createReducer(
  initialState,

  on(ExampleActions.updateSimpleControl, (state, { update }) => ({
    simpleControl: reduceControlState(state.simpleControl, update),
  }))
);

export function exampleReducer(state, action) {
  return internalExampleReducer(state, action);
}
