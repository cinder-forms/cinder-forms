import {
  CinderControlState,
  createValidator,
  initControlState,
  initGroup,
  reduceControlState,
  reduceGroupState,
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

const initialSimpleGroup = initGroup({
  text: ['Initial Text'],
  number: [0, [maxLength3]],
});

export type SimpleGroupState = typeof initialSimpleGroup;
export type SimpleGroupUpdate = toUpdate<SimpleGroupState>;

export const initialState: ExampleState = {
  simpleControl: intialSimpleControl,
  simpleGroup: initialSimpleGroup,
};

export interface ExampleState {
  simpleControl: SimpleControlState;
  simpleGroup: SimpleGroupState;
}

const internalExampleReducer = createReducer(
  initialState,

  on(ExampleActions.updateSimpleControl, (state, { update }) => ({
    ...state,
    simpleControl: reduceControlState(state.simpleControl, update),
  })),

  on(ExampleActions.updateSimpleGroup, (state, { update }) => ({
    ...state,
    simpleGroup: reduceGroupState(state.simpleGroup, update),
  }))
);

export function exampleReducer(state, action) {
  return internalExampleReducer(state, action);
}
