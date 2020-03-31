import { initGroup } from '../state/init';
import { resetGroupState } from './reset';

describe('resetGroupState', () => {
  it('should reset all controls', () => {
    const groupState = initGroup(
      {
        c1: {
          dirty: true,
          touched: true,
          disabled: true,
          initialValue: 'initial',
          value: 'other',
          validators: [() => 'test']
        }
      },
      [group => ({ c1: { error: 'some' } })]
    );

    const expected = initGroup(
      {
        c1: {
          value: groupState.controls.c1.initialValue,
          initialValue: groupState.controls.c1.initialValue,
          validators: groupState.controls.c1.validators,
          disabled: groupState.controls.c1.disabled
        }
      },
      groupState.validators
    );

    const result = resetGroupState(groupState);

    expect(result).toEqual(expected);
  });
});
