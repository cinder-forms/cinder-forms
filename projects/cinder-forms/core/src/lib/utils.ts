import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import {
  FormArrayErrors,
  FormControlErrors,
  FormControls,
  FormControlState,
  FormControlSummary,
  FormControlUpdate,
  FormGroupControlStates,
  FormGroupControlSummaries,
  FormGroupControlUpdates,
  FormGroupErrors,
  UnknownValidators,
  Validator
} from './types';

/**
 * Maps an object of control states to a value given by the `mapFunc`.
 *
 * @param controls Object which contains keys and associated control update.
 * @param mapFunc Mapper function to convert the update.
 *
 * @example
 * // Mapping of:
 * const controls = {
 *  firstControl: {
 *    value: 'firstValue',
 *    ...
 *  },
 *  secondControl: {
 *    value: 'secondValue',
 *    ...
 *  },
 * }
 *
 * // With the function:
 * const mapFunc = (control) => control.value
 *
 * // Will result in:
 * const result = {
 *  firstControl: 'firstValue',
 *  secondControl: 'secondValue'
 * }
 */
export function mapFormGroupControlStates<TControls extends FormControls, R>(
  controls: FormGroupControlStates<TControls>,
  mapFunc: (control: FormControlState<any, any>, key: string) => R
): {
  [K in keyof TControls]: R;
} {
  return mapFormControls<TControls, R>(controls, mapFunc);
}

/**
 * Maps an object of control summaries to a value given by the `mapFunc`.
 *
 * @param controls Object which contains keys and associated control summaries.
 * @param mapFunc Mapper function to convert the update.
 *
 * @example
 * // Mapping of:
 * const controls = {
 *  firstControl: {
 *    value: 'firstValue',
 *    ...
 *  },
 *  secondControl: {
 *    value: 'secondValue',
 *    ...
 *  },
 * }
 *
 * // With the function:
 * const mapFunc = (control) => control.value
 *
 * // Will result in:
 * const result = {
 *  firstControl: 'firstValue',
 *  secondControl: 'secondValue'
 * }
 */
export function mapFormGroupControlSummaries<TControls extends FormControls, R>(
  controls: FormGroupControlSummaries<TControls>,
  mapFunc: (control: FormControlSummary<any, any>, key: string) => R
): {
  [K in keyof TControls]: R;
} {
  return mapFormControls<TControls, R>(controls, mapFunc);
}

/**
 * Maps an object of control updates to a value given by the `mapFunc`.
 *
 * @param controls Object which contains keys and associated control updates.
 * @param mapFunc Mapper function to convert the update.
 *
 * @example
 * // Mapping of:
 * const controls = {
 *  firstControl: {
 *    value: 'firstValue',
 *    ...
 *  },
 *  secondControl: {
 *    value: 'secondValue',
 *    ...
 *  },
 * }
 *
 * // With the function:
 * const mapFunc = (control) => control.value
 *
 * // Will result in:
 * const result = {
 *  firstControl: 'firstValue',
 *  secondControl: 'secondValue'
 * }
 */
export function mapFormGroupControlUpdates<TControls extends FormControls, R>(
  controls: FormGroupControlUpdates<TControls>,
  mapFunc: (control: FormControlUpdate<any, any>, key: string) => R
): {
  [K in keyof TControls]: R;
} {
  return mapFormControls<TControls, R>(controls, mapFunc);
}

export function mapFormControls<TControls extends FormControls, R>(
  controls: {},
  mapFunc: (control: {}, key: string) => R
): {
  [K in keyof TControls]: R;
} {
  const result = Object.entries<{}>(controls)
    .map(([key, control]) => ({
      [key]: mapFunc(control, key)
    }))
    .reduce((ctrl1, ctrl2) => ({ ...ctrl1, ...ctrl2 }), {});

  return result as {
    [K in keyof TControls]: R;
  };
}

/**
 * Converts one or multiple Angular validators for the usage with this framework.
 * Does **not** support asynchronous validators.
 * Uses Validators.compose from @angular/forms.
 *
 * Only a subset of properties is available for the Angular validators:
 * `value, dirty, pristine, touched, untouched, enabled, disabled`
 * @param fn Angular validator function..
 */
export function validatorOf<T>(...fn: ValidatorFn[]): Validator<T, any> {
  const composed = Validators.compose(fn)!;

  return (control: FormControlState<T, any>) =>
    composed({
      value: control.value,
      pristine: !control.dirty,
      dirty: control.dirty,
      untouched: !control.touched,
      touched: control.touched,
      enabled: !control.disabled,
      disabled: control.disabled
    } as AbstractControl) || {};
}

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
      ...e2
    };
  }, {} as TErrors);
}

/**
 * Merges an array of errors.
 * The different child control errors will also be merged.
 * Returns `{}` if all errors are `{}`.
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
export function mergeFormGroupErrors<TControls extends FormControls>(
  ...errors: FormGroupErrors<TControls>[]
): FormGroupErrors<TControls> {
  if (errors.length === 0) {
    return {};
  }

  return errors.reduce((group1, group2) => ({
    ...group1,
    ...group2,
    ...Object.keys(group1)
      .filter(key1 => Object.keys(group2).find(key2 => key1 === key2))
      .map(key => ({
        [key]: mergeFormControlErrors(group1[key]!, group2[key]!)
      }))
      .reduce(
        (e1, e2) => ({
          ...e1,
          ...e2
        }),
        {}
      )
  }));
}

/**
 * Merges an array of errors.
 * Errors at each index will also be merged.
 * Returns `{}` if all errors are `{}`.
 * @param errors Multiple errors to be merged.
 *
 * @example
 * // Merge of:
 * [
 *   {
 *     firstError: 'firstError'
 *   }
 * ],
 * [
 *   stringControl: {
 *     secondError: 'secondError'
 *   }
 * ]
 *
 * // Will result in:
 * [
 *   {
 *     firstError: 'firstError',
 *     secondError: 'secondError'
 *   }
 * ]
 *
 */
export function mergeFormArrayErrors(...errors: FormArrayErrors[]): FormArrayErrors {
  return errors
    .filter(Boolean)
    .reduce((arr1, arr2) => (arr1.length >= arr2.length ? arr1 : arr2), [])
    .map((_, i) =>
      mergeFormControlErrors(...errors.map(arrayErrors => arrayErrors && arrayErrors[i]))
    );
}

/**
 * This function can be used to create a new validator.
 * The `isInvalid` function evaluates whether an error should be returned.
 * The error itself is build by the `buildError` function.
 *
 * @param isInvalid Function that evaluates to a boolean.
 *                  If truthy the Validator will return the error.
 * @param buildError Function that builds the error, which will be returned.
 *
 * @returns The error from `buildError` or `{}` if truthy.
 *
 * @example
 * const notEmpty = createValidator(
 *   control => control.value !== '',
 *   _ => ({ empty: true })
 * );
 */
export function createValidator<T extends any, TErrors extends FormControlErrors>(
  isInvalid: (control: FormControlState<T, UnknownValidators<T>>) => boolean,
  buildError: (control: FormControlState<T, UnknownValidators<T>>) => TErrors
): Validator<T, Partial<TErrors>> {
  return (control: FormControlState<T, UnknownValidators<T>>) =>
    isInvalid(control) ? buildError(control) : {};
}
