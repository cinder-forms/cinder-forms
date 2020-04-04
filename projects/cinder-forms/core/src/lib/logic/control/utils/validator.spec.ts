import { initControlState } from '../init/init';
import { CinderControlState } from './../init/types';
import { createValidator } from './validator';

describe('createValidator', () => {
  const someError = { someError: true };

  it('should return {} if isInvalid returns false', () => {
    const validator = createValidator(
      ({ value }: CinderControlState<boolean>) => value,
      () => someError
    );

    const control = initControlState([false]);

    const result = validator(control);

    expect(result).toEqual({});
  });

  it('should return error if isInvalid returns true', () => {
    const validator = createValidator(
      ({ value }: CinderControlState<boolean>) => value,
      () => someError
    );

    const control = initControlState([true]);

    const result = validator(control);

    expect(result).toEqual(someError);
  });
});
