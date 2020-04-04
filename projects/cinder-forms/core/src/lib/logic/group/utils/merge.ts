import { mergeFormControlErrors } from '../../../utils';
import { GroupErrors } from '../state/types';
import { ArrayElement } from '../../utils/types';
import { UnionToIntersection } from '../../control/init/types';

/**
 * Merges an array of errors.
 * The different child control errors will also be merged.
 * Returns null if all errors are null.
 * @param errors Multiple errors to be merged.
 *
 * @example
 * // Merge of:
 * {
 *   stringControl: {
 *     firstError: 'firstError'
 *   }
 * },
 * {
 *   stringControl: {
 *     secondError: 'secondError'
 *   }
 * }
 *
 * // Will result in:
 * {
 *   stringControl: {
 *     firstError: 'firstError',
 *     secondError: 'secondError'
 *   }
 * }
 *
 */
export function mergeGroupErrors<TGroupErrors extends GroupErrors[]>(
  ...errors: TGroupErrors
)  {
  return errors.reduce((group1, group2) => {
      return {
          ...group1,
          ...group2,
          ...Object.keys(group1)
              .filter(key1 => Object.keys(group2).find(key2 => key1 === key2))
              .map(key => ({
                  [key]: mergeFormControlErrors(group1[key], group2[key]),
              }))
              .reduce(
                  (e1, e2) => ({
                      ...e1,
                      ...e2,
                  }),
                  {}
              ),
      };
  }, {}) as unknown as UnionToIntersection<ArrayElement<TGroupErrors>>;
}