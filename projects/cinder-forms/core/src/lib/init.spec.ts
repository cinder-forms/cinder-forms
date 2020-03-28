import { initFormArray, initFormControl, initFormGroup } from './init';
import { FormArrayState, FormControlState, FormGroupState } from './types';

describe('init', () => {
  const validator = () => ({});
  const groupValidator = () => ({});
  const arrayValidator = () => [];

  const value = 'value';

  describe('initFormControl', () => {
    describe('initalizeTuple', () => {
      it('["value"] should create a valid form control state', () => {
        const expected: FormControlState<string> = {
          value,
          initialValue: value,
          disabled: false,
          dirty: false,
          touched: false,
          validators: []
        };

        const result = initFormControl([value]);

        expect(result).toEqual(expected);
      });

      it('["value", [() => {}]] should create a valid form control state with validator', () => {
        const expected: FormControlState<string> = {
          value,
          initialValue: value,
          disabled: false,
          dirty: false,
          touched: false,
          validators: [validator]
        };

        const result = initFormControl([value, [validator]]);

        expect(result).toEqual(expected);
      });

      it('["value", undefined, true] should create a valid form control state which is disabled', () => {
        const expected: FormControlState<string> = {
          value,
          initialValue: value,
          disabled: true,
          dirty: false,
          touched: false,
          validators: []
        };

        const result = initFormControl([value, undefined, true]);

        expect(result).toEqual(expected);
      });
    });

    describe('initialUpdate', () => {
      it('{value: value} should create a valid form control state', () => {
        const expected: FormControlState<string> = {
          value,
          initialValue: value,
          disabled: false,
          dirty: false,
          touched: false,
          validators: []
        };

        const result = initFormControl({ value });

        expect(result).toEqual(expected);
      });

      it('["value", [() => {}]] should create a valid form control state with validator', () => {
        const expected: FormControlState<string> = {
          value,
          initialValue: value,
          disabled: false,
          dirty: false,
          touched: false,
          validators: [validator]
        };

        const result = initFormControl({ value, validators: [validator] });

        expect(result).toEqual(expected);
      });

      it('{value: value, disabled: true, dirty: true, touched: true} should create a valid form control state', () => {
        const expected: FormControlState<string> = {
          value,
          initialValue: value,
          disabled: true,
          dirty: true,
          touched: true,
          validators: []
        };

        const result = initFormControl({
          value,
          disabled: expected.disabled,
          dirty: expected.dirty,
          touched: expected.touched,
          validators: []
        });

        expect(result).toEqual(expected);
      });

      it('value only should set initialValue', () => {
        const expected: FormControlState<string> = {
          value,
          initialValue: value,
          disabled: false,
          dirty: false,
          touched: false,
          validators: []
        };

        const result = initFormControl({
          value
        });

        expect(result).toEqual(expected);
      });

      it('intialValue should set initialValue', () => {
        const initialValue = 'initial';

        const expected: FormControlState<string> = {
          value,
          initialValue,
          disabled: false,
          dirty: false,
          touched: false,
          validators: []
        };

        const result = initFormControl({
          value,
          initialValue
        });

        expect(result).toEqual(expected);
      });
    });
  });

  describe('initFormGroup', () => {
    it('should create a valid form group (with initializeTuple & initUpdate)', () => {
      const expected: FormGroupState<{ tuple: string; update: string }> = {
        controls: {
          tuple: {
            disabled: false,
            dirty: false,
            touched: false,
            validators: [validator],
            value,
            initialValue: value
          },
          update: {
            disabled: true,
            dirty: true,
            touched: true,
            validators: [validator],
            value,
            initialValue: value
          }
        },
        validators: [groupValidator]
      };

      const result = initFormGroup(
        {
          tuple: [value, [validator]],
          update: {
            value,
            validators: [validator],
            disabled: true,
            dirty: true,
            touched: true
          }
        },
        [groupValidator]
      );

      expect(result).toEqual(expected);
    });
  });

  describe('initFormArray', () => {
    it('should create valid form group with initTuple', () => {
      const expected: FormArrayState<string> = {
        controls: [
          {
            value,
            validators: [validator],
            disabled: false,
            dirty: false,
            touched: false,
            initialValue: value
          }
        ],
        validators: [arrayValidator]
      };

      const result = initFormArray([[value, [validator]]], [arrayValidator]);

      expect(result).toEqual(expected);
    });

    it('should create valid form group with initUpdate', () => {
      const expected: FormArrayState<string> = {
        controls: [
          {
            value,
            validators: [validator],
            disabled: true,
            dirty: true,
            touched: true,
            initialValue: value
          }
        ],
        validators: [arrayValidator]
      };

      const result = initFormArray(
        [
          {
            value,
            validators: [validator],
            disabled: true,
            dirty: true,
            touched: true
          }
        ],
        [arrayValidator]
      );

      expect(result).toEqual(expected);
    });
  });
});
