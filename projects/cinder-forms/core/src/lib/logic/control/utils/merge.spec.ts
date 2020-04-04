import { FormControlErrors } from '../init/types';
import { mergeFormControlErrors } from './merge';

describe('mergeFormControlErrors', () => {
  it('{}, {} should return {}', () => {
    const result = mergeFormControlErrors({}, {});

    expect(result).toEqual({});
  });

  it('{}, error2 should return error2', () => {
    const error2: FormControlErrors = {
      error2: 'error2',
    };

    const result = mergeFormControlErrors({}, error2);

    expect(result).toEqual(error2);
  });

  it('error1, {} should return error1', () => {
    const error1: FormControlErrors = {
      error1: 'error1',
    };

    const result = mergeFormControlErrors(error1, {});

    expect(result).toEqual(error1);
  });

  it('should merge 2 errors', () => {
    const error1: FormControlErrors = {
      error1: 'error1',
    };

    const error2: FormControlErrors = {
      error2: 'error2',
    };

    const expected = {
      error1: 'error1',
      error2: 'error2',
    };

    const result = mergeFormControlErrors(error1, error2);

    expect(result).toEqual(expected);
  });

  it('should override duplicate attribute of first error', () => {
    const error1: FormControlErrors = {
      duplicate: 'error1',
    };

    const error2: FormControlErrors = {
      duplicate: 'error2',
    };

    const expected = {
      duplicate: 'error2',
    };

    const result = mergeFormControlErrors(error1, error2);

    expect(result).toEqual(expected);
  });

  it('should merge 3+ errors', () => {
    const error1: FormControlErrors = {
      error1: 'error1',
    };

    const error2: FormControlErrors = {
      error2: 'error2',
    };

    const error3: FormControlErrors = {
      error3: 'error3',
    };

    const expected = {
      error1: 'error1',
      error2: 'error2',
      error3: 'error3',
    };

    const result = mergeFormControlErrors(error1, error2, error3);

    expect(result).toEqual(expected);
  });
});
