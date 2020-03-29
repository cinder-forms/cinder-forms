import { initFormControl } from '../../init';
import { createValidator } from '../../utils';
import { selectGroup } from '../select';
import { initGroup } from './init';
import { CinderGroupState, GroupStateValidator } from './types';

const v1 = createValidator(
  () => true,
  () => ({ v1: 'v1' })
);

const k1 = initFormControl('', []);
const k2 = initFormControl(123, [v1], true);

const groupValidator = undefined as GroupStateValidator<{}, {}>;

describe('initGroup', () => {
  it('should create group with control validators', () => {
    const result = initGroup(ctrl => ({
      k1: ctrl(k1.value, k1.validators),
      k2: ctrl(k2.value, k2.validators, k2.disabled)
    }));

    const expected: CinderGroupState<any, any> = {
      controls: {
        k1,
        k2
      },
      validators: []
    };

    const g = selectGroup(result);
  });

  it('should create group with group validator', () => {
    const result = initGroup(_ => ({}), [groupValidator]);

    const expected: CinderGroupState<any, any> = {
      controls: {},
      validators: [groupValidator]
    };

    expect(result).toEqual(expected);
  });
});
