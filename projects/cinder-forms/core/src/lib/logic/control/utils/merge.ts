import { ControlErrors } from '../init/types';

/**
 * Merges an array of `ControlErrors`.
 * Returns `{}` if all errors are `{}`.
 * @param errors An array of `ControlErrors` which will be merged into a single `ControlErrors` value.
 */
export function mergeControlErrors<TErrors extends ControlErrors>(...errors: TErrors[]): TErrors {
  return errors.reduce<TErrors>((e1, e2) => {
    return {
      ...e1,
      ...e2,
    };
  }, {} as TErrors);
}
