import { initFormControl } from './init/init';
import { FormControlState } from './init/types';
import { getFormControlSummary } from './selectors';
import { FormControlSummary } from './types';

describe('selectors', () => {
  describe('errors', () => {
    it('should return {} for empty validators', () => {
      const control = initFormControl({ value: '' });

      const result = getFormControlSummary(control);

      expect(result.errors).toEqual({});
    });

    it('should return error', () => {
      const validator = () => ({
        alwaysTrue: true,
      });
      const control = initFormControl(['', [validator]]);

      const expected = {
        alwaysTrue: true,
      };
      const result = getFormControlSummary(control);

      expect(result.errors).toEqual(expected);
    });

    it('should return multiple erros', () => {
      const validators = [
        () => ({
          alwaysTrue: true,
        }),
        () => ({
          alwaysFalse: false,
        }),
      ];
      const control = initFormControl(['', validators]);

      const expected = {
        alwaysTrue: true,
        alwaysFalse: false,
      };
      const result = getFormControlSummary(control);

      expect(result.errors).toEqual(expected);
    });
  });

  describe('getFormControlSummary', () => {
    [undefined, null, 0, { value: 'value' }].forEach((value) => {
      it(`${value} match should return changed: false`, () => {
        const result = getFormControlSummary(initFormControl([value]));

        expect(result.changed).toEqual(false);
      });
    });

    it('should return changed: true for changed simple value', () => {
      const result = getFormControlSummary(
        initFormControl({
          value: 'value',
          initialValue: 'initialValue',
        })
      );

      expect(result.changed).toEqual(true);
    });

    it('should return changed: true for object key value change', () => {
      const result = getFormControlSummary(
        initFormControl({
          value: { deeper: { deep: 'value' } },
          initialValue: { deeper: { deep: 'initialValue' } },
        })
      );

      expect(result.changed).toEqual(true);
    });

    it('should returninvalid = false, errors = {}, controls for valid control', () => {
      const control: FormControlState<string> = {
        dirty: false,
        touched: false,
        value: '',
        initialValue: '',
        validators: [],
        disabled: false,
      };

      const expected: FormControlSummary<string> = {
        dirty: false,
        touched: false,
        value: '',
        initialValue: '',
        validators: [],
        disabled: false,
        errors: {},
        invalid: false,
        changed: false,
      };

      const result = getFormControlSummary(control);

      expect(result).toEqual(expected);
    });

    it('should return invalid = true, errors = errors, controls for invalid control', () => {
      const error = {
        alwaysTrue: true,
      };

      const validators = [() => error];

      const control: FormControlState<string> = {
        dirty: false,
        touched: false,
        value: '',
        initialValue: '',
        validators,
        disabled: false,
      };

      const expected: FormControlSummary<string> = {
        dirty: control.dirty,
        touched: control.touched,
        value: control.value,
        initialValue: '',
        validators,
        disabled: false,
        errors: error,
        invalid: true,
        changed: false,
      };

      const result = getFormControlSummary(control);

      expect(result).toEqual(expected);
    });

    it('should return invalid = true, errors = errors, controls for additional errors', () => {
      const additionalError = {
        additionalError: true,
      };

      const control: FormControlState<string> = {
        dirty: false,
        touched: false,
        value: '',
        initialValue: '',
        validators: [],
        disabled: false,
      };

      const expected: FormControlSummary<string> = {
        dirty: control.dirty,
        touched: control.touched,
        value: control.value,
        validators: [],
        initialValue: '',
        disabled: false,
        errors: additionalError,
        invalid: true,
        changed: false,
      };

      const result = getFormControlSummary(control, additionalError);

      expect(result).toEqual(expected);
    });

    it('should merge errors with additional errors', () => {
      const additionalError = {
        additionalError: true,
      };

      const error = {
        alwaysTrue: true,
      };

      const validators = [() => error];

      const control: FormControlState<string> = {
        dirty: false,
        touched: false,
        value: '',
        initialValue: '',
        validators,
        disabled: false,
      };

      const expected: FormControlSummary<string> = {
        dirty: control.dirty,
        touched: control.touched,
        value: control.value,
        initialValue: '',
        validators,
        disabled: false,
        errors: { alwaysTrue: true, additionalError: true },
        invalid: true,
        changed: false,
      };

      const result = getFormControlSummary(control, additionalError);

      expect(result).toEqual(expected);
    });
  });
});
