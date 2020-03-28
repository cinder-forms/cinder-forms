import { initFormArray, initFormControl, initFormGroup } from './init';
import { resetFormArray, resetFormControl, resetFormGroup } from './reset';
import { FormArrayState, FormControlState, FormGroupState } from './types';

describe('resetFormControl', () => {
  const initialValue = 'initial';
  const validators = [() => ({})];
  const disabled = true;

  const control: FormControlState<string, typeof validators> = {
    disabled,
    initialValue,
    dirty: true,
    touched: true,
    validators,
    value: 'value'
  };

  it('should keep validators', () => {
    const result = resetFormControl(control);

    expect(result.validators).toEqual(validators);
  });

  it('should keep disabled', () => {
    const result = resetFormControl(control);

    expect(result.disabled).toEqual(disabled);
  });

  it('should reset everything except validators to initial', () => {
    const result = resetFormControl(control);
    const expected = initFormControl([initialValue]);

    expected.validators = validators;
    expected.disabled = disabled;

    expect(result).toEqual(expected);
  });

  it('should set initialValue and value if passed', () => {
    const newValue = 'newValue';

    const result = resetFormControl(control, newValue);

    expect(result.value).toEqual(newValue);
    expect(result.initialValue).toEqual(newValue);
  });
});

describe('resetFormGorup', () => {
  const initialValue1 = 'init1';
  const initialValue2 = 'init2';

  const validators1 = [() => ({ alwaysTrue: true })];
  const validators2 = [];

  const group: FormGroupState<{ k1: string; k2: string }> = {
    controls: {
      k1: {
        disabled: true,
        initialValue: initialValue1,
        value: 'some1',
        dirty: true,
        touched: false,
        validators: validators1
      },
      k2: {
        disabled: false,
        initialValue: initialValue2,
        value: 'some2',
        dirty: true,
        touched: false,
        validators: validators2
      }
    },
    validators: []
  };

  it('should reset group', () => {
    const result = resetFormGroup(group);
    const expected: typeof group = initFormGroup({
      k1: [initialValue1, validators1, true],
      k2: [initialValue2, validators2, false]
    });

    expect(result).toEqual(expected);
  });
});

describe('resetFormArray', () => {
  const initialValue1 = 'init1';
  const initialValue2 = 'init2';

  const validators1 = [() => ({ alwaysTrue: true })];
  const validators2 = [];

  const arrayValidators = [() => [{ always6: 6 }, {}]];

  const array: FormArrayState<string> = {
    controls: [
      {
        disabled: true,
        initialValue: initialValue1,
        value: 'some1',
        dirty: true,
        touched: false,
        validators: validators1
      },
      {
        disabled: false,
        initialValue: initialValue2,
        value: 'some2',
        dirty: true,
        touched: false,
        validators: validators2
      }
    ],
    validators: arrayValidators
  };

  it('should reset array', () => {
    const result = resetFormArray(array);
    const expected: typeof array = initFormArray(
      [
        [initialValue1, validators1, true],
        [initialValue2, validators2, false]
      ],
      arrayValidators
    );

    expect(result).toEqual(expected);
  });
});
