import { initControlState } from '../init/init';
import { CinderControlState } from '../init/types';
import { validatorOf } from './validator-of';

describe('validatorOf', () => {
  it('should support value property', () => {
    const expected = { value: 'val' };

    const resultFunc = validatorOf((control) => ({
      value: control.value,
    }));

    const result = resultFunc(initControlState([expected.value]));

    expect(result).toEqual(expected);
  });

  it('should support dirty property', () => {
    const expected = { dirty: true };

    const resultFunc = validatorOf((control) => ({
      dirty: control.dirty,
    }));

    const result = resultFunc({ dirty: true } as CinderControlState<any>);

    expect(result).toEqual(expected);
  });

  it('should support pristine property', () => {
    const expected = { dirty: false };

    const resultFunc = validatorOf((control) => ({
      dirty: control.dirty,
    }));

    const result = resultFunc({ dirty: false } as CinderControlState<any>);

    expect(result).toEqual(expected);
  });

  it('should support touched property', () => {
    const expected = { touched: true };

    const resultFunc = validatorOf((control) => ({
      touched: control.touched,
    }));

    const result = resultFunc({ touched: true } as CinderControlState<any>);

    expect(result).toEqual(expected);
  });

  it('should support touched property', () => {
    const expected = { touched: false };

    const resultFunc = validatorOf((control) => ({
      touched: control.touched,
    }));

    const result = resultFunc({ touched: false } as CinderControlState<any>);

    expect(result).toEqual(expected);
  });

  it('should support disabled property', () => {
    const expected = { disabled: true };

    const resultFunc = validatorOf((control) => ({
      disabled: control.disabled,
    }));

    const result = resultFunc({ disabled: true } as CinderControlState<any>);

    expect(result).toEqual(expected);
  });

  it('should support enabled property', () => {
    const expected = { enabled: true };

    const resultFunc = validatorOf((control) => ({
      enabled: control.enabled,
    }));

    const result = resultFunc({ disabled: false } as CinderControlState<any>);

    expect(result).toEqual(expected);
  });

  it('should merge multiple validators', () => {
    const expected = { first: true, second: true };

    const resultFunc = validatorOf(
      (control) => ({
        first: true,
      }),
      (control) => ({
        second: true,
      })
    );

    const result = resultFunc({} as CinderControlState<any>);

    expect(result).toEqual(expected);
  });
});
