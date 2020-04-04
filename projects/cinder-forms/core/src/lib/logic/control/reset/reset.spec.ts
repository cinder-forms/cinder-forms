import { initControlState } from '../init/init';
import { CinderControlState } from '../init/types';
import { resetControlState } from './reset';

describe('resetControlState', () => {
  const initialValue = 'initial';
  const validators = [() => ({})];
  const disabled = true;

  const control: CinderControlState<string, typeof validators> = {
    disabled,
    initialValue,
    dirty: true,
    touched: true,
    validators,
    value: 'value',
  };

  it('should keep validators', () => {
    const result = resetControlState(control);

    expect(result.validators).toEqual(validators);
  });

  it('should keep disabled', () => {
    const result = resetControlState(control);

    expect(result.disabled).toEqual(disabled);
  });

  it('should reset everything except validators to initial', () => {
    const result = resetControlState(control);
    const expected = initControlState([initialValue]);

    expected.validators = validators;
    expected.disabled = disabled;

    expect(result).toEqual(expected);
  });

  it('should set initialValue and value if passed', () => {
    const newValue = 'newValue';

    const result = resetControlState(control, newValue);

    expect(result.value).toEqual(newValue);
    expect(result.initialValue).toEqual(newValue);
  });
});
