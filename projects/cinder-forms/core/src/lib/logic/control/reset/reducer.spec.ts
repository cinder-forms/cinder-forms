import { initControlState } from '../init/init';
import { CinderControlUpdate } from '../init/types';
import { reduceControlState } from './reducer';

describe('reducer', () => {
  describe('reduceControlState', () => {
    it('empty update should do nothing', () => {
      const control = initControlState(['test']);

      const update = {};

      const result = reduceControlState(control, update);

      expect(result).toEqual(control);
    });

    it('value update should only update value', () => {
      const control = initControlState(['test']);

      const expected = {
        ...control,
        value: 'new',
      };

      const update: CinderControlUpdate<string> = {
        value: 'new',
      };

      const result = reduceControlState(control, update);

      expect(result).toEqual(expected);
    });

    it('undefined update should do nothing', () => {
      const control = initControlState(['test']);

      const update = undefined;

      const result = reduceControlState(control, update);

      expect(result).toEqual(control);
    });

    it('{} update should do nothing', () => {
      const control = initControlState(['test']);

      const update = {};

      const result = reduceControlState(control, update);

      expect(result).toEqual(control);
    });
  });
});
