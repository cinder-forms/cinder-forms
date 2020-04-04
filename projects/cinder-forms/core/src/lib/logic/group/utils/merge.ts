import { mergeFormControlErrors } from '../../../utils';
import { GroupErrors, GroupStateControls } from '../state/types';

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
): TGroupErrors[0]  {
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
  }, {});
}
