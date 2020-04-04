import { initFormControl } from './init';
import { CinderControlState } from './types';

describe('init', () => {
  const noValidators = [];
  const validator = () => ({});

  const value = 'value';

  describe('initFormControl', () => {
    describe('initalizeTuple', () => {
      it('["value"] should create a valid form control state', () => {
        const expected: CinderControlState<string, typeof noValidators> = {
          value,
          initialValue: value,
          disabled: false,
          dirty: false,
          touched: false,
          validators: [],
        };

        const result = initFormControl([value]);

        expect(result).toEqual(expected);
      });

      it('["value", [() => {}]] should create a valid form control state with validator', () => {
        const expected: CinderControlState<string, typeof noValidators> = {
          value,
          initialValue: value,
          disabled: false,
          dirty: false,
          touched: false,
          validators: [validator],
        };

        const result = initFormControl([value, [validator]]);

        expect(result).toEqual(expected);
      });

      it('["value", undefined, true] should create a valid form control state which is disabled', () => {
        const expected: CinderControlState<string, typeof noValidators> = {
          value,
          initialValue: value,
          disabled: true,
          dirty: false,
          touched: false,
          validators: [],
        };

        const result = initFormControl([value, [], true]);

        expect(result).toEqual(expected);
      });
    });

    describe('initialUpdate', () => {
      it('{value: value} should create a valid form control state', () => {
        const expected: CinderControlState<string, typeof noValidators> = {
          value,
          initialValue: value,
          disabled: false,
          dirty: false,
          touched: false,
          validators: [],
        };

        const result = initFormControl({ value });

        expect(result).toEqual(expected);
      });

      it('["value", [() => {}]] should create a valid form control state with validator', () => {
        const expected: CinderControlState<string, typeof noValidators> = {
          value,
          initialValue: value,
          disabled: false,
          dirty: false,
          touched: false,
          validators: [validator],
        };

        const result = initFormControl({ value, validators: [validator] });

        expect(result).toEqual(expected);
      });

      it('{value: value, disabled: true, dirty: true, touched: true} should create a valid form control state', () => {
        const expected: CinderControlState<string, typeof noValidators> = {
          value,
          initialValue: value,
          disabled: true,
          dirty: true,
          touched: true,
          validators: [],
        };

        const result = initFormControl({
          value,
          disabled: expected.disabled,
          dirty: expected.dirty,
          touched: expected.touched,
          validators: [],
        });

        expect(result).toEqual(expected);
      });

      it('value only should set initialValue', () => {
        const expected: CinderControlState<string, typeof noValidators> = {
          value,
          initialValue: value,
          disabled: false,
          dirty: false,
          touched: false,
          validators: [],
        };

        const result = initFormControl({
          value,
        });

        expect(result).toEqual(expected);
      });

      it('intialValue should set initialValue', () => {
        const initialValue = 'initial';

        const expected: CinderControlState<string, typeof noValidators> = {
          value,
          initialValue,
          disabled: false,
          dirty: false,
          touched: false,
          validators: noValidators,
        };

        const result = initFormControl({
          value,
          initialValue,
        });

        expect(result).toEqual(expected);
      });
    });
  });
});
