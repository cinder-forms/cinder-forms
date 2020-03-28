import { Validators } from '@angular/forms';
import {
  ArrayValidator,
  createValidator,
  FormControlState,
  FormGroupState,
  initFormArray,
  initFormControl,
  initFormGroup,
  reduceFormArray,
  reduceFormControl,
  reduceFormGroup,
  resetFormGroup,
  validatorOf
} from '@cinder-forms/core';
import { createReducer, on } from '@ngrx/store';
import * as ExampleActions from './example.actions';

const below6 = createValidator(
  ({ value }) => value < 6,
  () => ({ below6: {} })
);

const required = createValidator(
  ({ value }: FormControlState<string>) => value.length !== 0,
  () => ({ required: true })
);

const noDuplicates: ArrayValidator<string> = ({ controls }) =>
  controls
    .map(control =>
      controls.find(bufferCtrl => control !== bufferCtrl && control.value === bufferCtrl.value)
    )
    .map(result => (result ? { duplicate: true } : {}));

export interface ExampleGroupControls {
  textInput: string;
  numberInput: number;
  rangeInput: number;
  checkboxInput: boolean;
  customInput: number;
}

export interface StateAccessExampleFormControls {
  exampleInput: number;
}

const initialSingleControl = initFormControl(['initial', [required]]);

const initialGroup = initFormGroup({
  textInput: { value: 'disabled', disabled: true },
  numberInput: [0, [validatorOf(Validators.required), below6]],
  rangeInput: [0],
  checkboxInput: [false],
  customInput: [0]
});

const initialArray = initFormArray([['first'], ['second']], [noDuplicates]);

export interface ExampleState {
  singleControl: typeof initialSingleControl;
  group: typeof initialGroup;
  array: typeof initialArray;
  stateAccessExampleGroup: FormGroupState<StateAccessExampleFormControls>;
  forbiddenNumber: number;
}

export const initialState: ExampleState = {
  singleControl: initialSingleControl,
  group: initialGroup,
  array: initialArray,
  stateAccessExampleGroup: initFormGroup({ exampleInput: [1] }),
  forbiddenNumber: 2
};

const internalExampleReducer = createReducer(
  initialState,

  on(ExampleActions.updateSingleFormControl, (state, { update }) => ({
    ...state,
    singleControl: reduceFormControl(state.singleControl, update)
  })),

  on(ExampleActions.updateFormGroup, (state, { update }) => ({
    ...state,
    group: reduceFormGroup(state.group, update)
  })),

  on(ExampleActions.resetFormGroup, state => ({
    ...state,
    group: resetFormGroup(state.group)
  })),

  on(ExampleActions.updateFormArray, (state, { update }) => ({
    ...state,
    array: reduceFormArray(state.array, update)
  })),

  on(ExampleActions.addControlToArray, state => ({
    ...state,
    array: {
      ...state.array,
      controls: [...state.array.controls, initFormControl(['new'])]
    }
  })),

  on(ExampleActions.updateStateAccessExampleFormGroup, (state, props) => ({
    ...state,
    stateAccessExampleGroup: reduceFormGroup(state.stateAccessExampleGroup, props.update)
  }))
);

export function exampleReducer(state, action) {
  return internalExampleReducer(state, action);
}
