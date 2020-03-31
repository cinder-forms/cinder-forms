import { createValidator } from '../../../utils';
import { initFormControl } from '../../control/init/init';
import { selectGroup } from '../select';
import { initGroup } from './init';
import {
  CinderGroupState,
  GroupStateValidator,
  GroupValidators,
  toGroupStateControls
} from './types';

const v1 = createValidator(
  () => true,
  () => ({ required: true })
);

const k1 = initFormControl(['', []]);
const k2 = initFormControl([123, [v1], true]);

describe('initGroup', () => {
  it('should create group with control validators', () => {
    const result = initGroup({
      k1: [k1.value, k1.validators],
      k2: [k2.value, k2.validators, k2.disabled]
    });

    const expected: typeof result = {
      controls: {
        k1,
        k2
      },
      validators: []
    };

    expect(result).toEqual(expected);
  });

  it('should create group with group validator', () => {
    const groupValidator = () => ({});
    const result = initGroup({}, [groupValidator]);

    const expected: typeof result = {
      controls: {},
      validators: [groupValidator]
    };

    expect(result).toEqual(expected);
  });
});
