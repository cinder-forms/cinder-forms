import { initGroup } from '../state/init';
import { reduceGroupState } from './reduce';
import { toGroupUpdate } from './types';

describe('reduceGroupState', () => {
  it('empty update should do nothing', () => {
    const group = initGroup({ test: ['test'] });

    const update = {};

    const result = reduceGroupState(group, update);

    expect(result).toEqual(group);
  });

  it('undefined update should do nothing', () => {
    const group = initGroup({ test: ['test'] });

    const update = undefined;

    const result = reduceGroupState(group, update);

    expect(result).toEqual(group);
  });

  it('group update should only update affected', () => {
    const group = initGroup({
      affected: ['affected'],
      unaffected: ['unaffected']
    });

    const update: toGroupUpdate<typeof group> = {
      controls: {
        affected: {
          value: 'new',
          disabled: true
        }
      }
    };

    const expected: typeof group = {
      ...group,
      controls: {
        ...group.controls,
        affected: {
          ...group.controls.affected,
          value: 'new',
          disabled: true
        }
      }
    };

    const result = reduceGroupState(group, update);

    expect(result).toEqual(expected);
  });

  it('group update should work with group state ', () => {
    const group = initGroup({
      affected: ['affected'],
      unaffected: ['unaffected']
    });

    const update = initGroup({
      affected: ['updated1']
    });

    const expected: typeof group = {
      ...group,
      controls: {
        ...group.controls,
        affected: {
          ...group.controls.affected,
          value: 'updated1',
          initialValue: 'updated1'
        }
      }
    };

    const result = reduceGroupState(group, update);

    expect(result).toEqual(expected);
  });
});
