import { FormControlState } from '../../types';
import { createValidator } from '../../utils';
import { selectGroup } from './select';
import { initGroup } from './state/init';
import { createGroupValidator } from './validator/validator';

describe('selectGroup', () => {
  const equalsTest = createValidator(
    ({ value }: FormControlState<string>) => value === 'test',
    () => ({ equalsTest: 'yes' })
  );

  const createTestGroup = () =>
    initGroup(
      control => ({
        key1: control('test', [equalsTest]),
        key2: control('notTest', [equalsTest])
      }),
      []
    );

  let baseGroupState: ReturnType<typeof createTestGroup>;

  beforeEach(() => {
    baseGroupState = createTestGroup();
  });

  it('validators should merge errors correctly', () => {
    const result = selectGroup(baseGroupState);

    expect(result.errors).toEqual({
      key1: { equalsTest: 'yes' },
      key2: {}
    });
  });

  describe('dirty', () => {
    it('one control dirty:true => group dirty:true', () => {
      baseGroupState.controls.key1.dirty = true;
      const result = selectGroup(baseGroupState);

      expect(result.dirty).toEqual(true);
    });

    it('all controls dirty:false => group dirty:false', () => {
      const result = selectGroup(baseGroupState);

      expect(result.dirty).toEqual(false);
    });
  });

  describe('touched', () => {
    it('one control touched:true => group touched:true', () => {
      baseGroupState.controls.key1.touched = true;
      const result = selectGroup(baseGroupState);

      expect(result.touched).toEqual(true);
    });

    it('all controls touched:false => group touched:false', () => {
      const result = selectGroup(baseGroupState);

      expect(result.touched).toEqual(false);
    });
  });

  describe('changed', () => {
    it('one control changed:true => group changed:true', () => {
      baseGroupState.controls.key1.value = 'changed';
      const result = selectGroup(baseGroupState);

      expect(result.changed).toEqual(true);
    });

    it('all controls changed:false => group changed:false', () => {
      const result = selectGroup(baseGroupState);

      expect(result.changed).toEqual(false);
    });
  });

  describe('invalid', () => {
    it('one control invalid:true => group invalid:true', () => {
      baseGroupState.controls.key1.value = 'test';
      const result = selectGroup(baseGroupState);

      expect(result.invalid).toEqual(true);
    });

    it('all controls invalid:false => group invalid:false', () => {
      baseGroupState.controls.key1.value = 'notTest';
      const result = selectGroup(baseGroupState);

      expect(result.invalid).toEqual(false);
    });
  });
});
