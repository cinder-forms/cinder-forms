import {  initFormControl } from '../init/init';
import { FormControlUpdate } from '../init/types';
import {  reduceFormControl } from './reducer';

describe('reducer', () => {
  describe('reduceFormControl', () => {
    it('empty update should do nothing', () => {
      const control = initFormControl(['test']);

      const update = {};

      const result = reduceFormControl(control, update);

      expect(result).toEqual(control);
    });

    it('value update should only update value', () => {
      const control = initFormControl(['test']);

      const expected = {
        ...control,
        value: 'new'
      };

      const update: FormControlUpdate<string> = {
        value: 'new'
      };

      const result = reduceFormControl(control, update);

      expect(result).toEqual(expected);
    });

    it('undefined update should do nothing', () => {
      const control = initFormControl(['test']);

      const update = undefined;

      const result = reduceFormControl(control, update);

      expect(result).toEqual(control);
    });

    it('{} update should do nothing', () => {
      const control = initFormControl(['test']);

      const update = {};

      const result = reduceFormControl(control, update);

      expect(result).toEqual(control);
    });
  });
});
