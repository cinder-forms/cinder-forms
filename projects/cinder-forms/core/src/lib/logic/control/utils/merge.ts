import { FormControlErrors } from '../init/types';

/**
 * Merges an array of `FormControlErrors`.
 * Returns `{}` if all errors are `{}`.
 * @param errors An array of `FormControlErrors` which will be merged into a single `FormControlErrors` value.
 */
export function mergeFormControlErrors<TErrors extends FormControlErrors>(
  ...errors: TErrors[]
): TErrors {
  return errors.reduce<TErrors>((e1, e2) => {
    return {
      ...e1,
      ...e2,
    };
  }, {} as TErrors);
}
