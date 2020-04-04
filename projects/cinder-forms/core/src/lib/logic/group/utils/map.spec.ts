import { initGroup } from '../state/init';
import { mapGroupStateControls } from './map';

describe('mapGroupStateControls', () => {
  it('should return {} for {}', () => {
    const input = initGroup({});

    const result = mapGroupStateControls(input.controls, () => 'test');

    expect(result).toEqual({});
  });

  it('should map accordingly', () => {
    const input = initGroup({
      c1: ['a'],
      c2: ['b']
    });

    const expected = {
      c1: 'a',
      c2: 'b'
    };

    const result = mapGroupStateControls(input.controls, control => control.value);

    expect(result).toEqual(expected);
  });
});
