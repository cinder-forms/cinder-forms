import {
  CinderControlState,
  createValidator,
  initControlState,
  reduceControlState,
  toUpdate,
} from '@cinder-forms/core';
import { createReducer, on } from '@ngrx/store';
import * as ExampleActions from './example.actions';

const maxLength3 = createValidator(
  (control: CinderControlState<string>) => control.value.length > 3,
  () => ({ maxLength3: true })
);

const intialSimpleControl = initControlState(['test', [maxLength3]]);

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
