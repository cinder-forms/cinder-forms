import { initFormControl } from '../init/init';
import { FormControlState } from './../init/types';
import { createValidator } from './validator';

describe('createValidator', () => {
  const someError = { someError: true };

  it('should return {} if isInvalid returns false', () => {
    const validator = createValidator(
      ({ value }: FormControlState<boolean>) => value,
      () => someError
    );

    const control = initFormControl([false]);

    const result = validator(control);

    expect(result).toEqual({});
  });

  it('should return error if isInvalid returns true', () => {
    const validator = createValidator(
      ({ value }: FormControlState<boolean>) => value,
      () => someError
    );

    const control = initFormControl([true]);

    const result = validator(control);

    expect(result).toEqual(someError);
  });
});
