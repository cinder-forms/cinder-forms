import { initFormControl } from '../init/init';
import { FormControlState } from '../init/types';
import { resetFormControl } from './reset';

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
