import { initControlState } from '../../control/init/init';
import { createValidator } from '../../control/utils/validator';
import { initGroup } from './init';

const v1 = createValidator(
  () => true,
  () => ({ required: true })
);

const k1 = initControlState(['', []]);
const k2 = initControlState([123, [v1], true]);

describe('initGroup', () => {
  it('should create group with control validators', () => {
    const result = initGroup({
      k1: [k1.value, k1.validators],
      k2: [k2.value, k2.validators, k2.disabled],
    });

    const expected: typeof result = {
      controls: {
        k1,
        k2,
      },
      validators: [],
    };

    expect(result).toEqual(expected);
  });

  it('should create group with group validator', () => {
    const groupValidator = () => ({});
    const result = initGroup({}, [groupValidator]);

    const expected: typeof result = {
      controls: {},
      validators: [groupValidator],
    };

    expect(result).toEqual(expected);
  });
});
