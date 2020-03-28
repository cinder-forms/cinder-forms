import { initFormArray, initFormControl, initFormGroup } from './init';
import {
  getFormArrayChanged,
  getFormArrayControlSummaries,
  getFormArrayControlSummariesErrors,
  getFormArrayDirty,
  getFormArraySummary,
  getFormArrayTouched,
  getFormControlErrors,
  getFormControlSummary,
  getFormGroupChanged,
  getFormGroupControlSummaries,
  getFormGroupControlSummariesErrors,
  getFormGroupDirty,
  getFormGroupSummary,
  getFormGroupTouched
} from './selectors';
import {
  ArrayValidator,
  FormArrayErrors,
  FormArraySummary,
  FormControlState,
  FormControlSummary,
  FormGroupErrors,
  FormGroupState,
  FormGroupSummary
} from './types';

describe('selectors', () => {
  describe('getFormControlErrors', () => {
    it('should return [] for empty validators', () => {
      const control = initFormControl({ value: '' });

      const result = getFormControlErrors(control);

      expect(result).toEqual([]);
    });

    it('should return error', () => {
      const validator = () => ({
        alwaysTrue: true
      });
      const control = initFormControl(['', [validator]]);

      const expected = [
        {
          alwaysTrue: true
        }
      ];
      const result = getFormControlErrors(control);

      expect(result).toEqual(expected);
    });

    it('should return multiple erros', () => {
      const validators = [
        () => ({
          alwaysTrue: true
        }),
        () => ({
          alwaysFalse: false
        })
      ];
      const control = initFormControl(['', validators]);

      const expected = [
        {
          alwaysTrue: true
        },
        {
          alwaysFalse: false
        }
      ];
      const result = getFormControlErrors(control);

      expect(result).toEqual(expected);
    });
  });

  describe('getFormGroupControlSummariesErrors', () => {
    it('should return {} for no control errors', () => {
      const group = initFormGroup({
        c1: ['c1']
      });

      const result = getFormGroupControlSummariesErrors(
        getFormGroupControlSummaries(group.controls)
      );

      expect(result).toEqual({});
    });

    it('should return control + error', () => {
      const validator = () => ({
        alwaysTrue: true
      });

      const group = initFormGroup({
        c1: ['c1', [validator]]
      });

      const expected = {
        c1: {
          alwaysTrue: true
        }
      };

      const result = getFormGroupControlSummariesErrors(
        getFormGroupControlSummaries(group.controls)
      );

      expect(result).toEqual(expected);
    });

    it('should return multiple controls + errors', () => {
      const validatorAlwaysTrue = () => ({
        alwaysTrue: true
      });

      const validatorAlwaysFalse = () => ({
        alwaysFalse: false
      });

      const group = initFormGroup({
        c1: ['', [validatorAlwaysTrue]],
        c2: ['', [validatorAlwaysFalse]]
      });

      const expected = {
        c1: {
          alwaysTrue: true
        },
        c2: {
          alwaysFalse: false
        }
      };

      const result = getFormGroupControlSummariesErrors(
        getFormGroupControlSummaries(group.controls)
      );

      expect(result).toEqual(expected);
    });
  });

  describe('getFormArrayControlSummariesErrors', () => {
    it('should return {} for no control errors', () => {
      const array = initFormArray([['c1']]);

      const result = getFormArrayControlSummariesErrors(
        getFormArrayControlSummaries(array.controls)
      );

      expect(result).toEqual([{}]);
    });

    it('should return control + error', () => {
      const validator = () => ({
        alwaysTrue: true
      });

      const array = initFormArray([['c1', [validator]]]);

      const expected = [
        {
          alwaysTrue: true
        }
      ];

      const result = getFormArrayControlSummariesErrors(
        getFormArrayControlSummaries(array.controls)
      );

      expect(result).toEqual(expected);
    });

    it('should return multiple controls + errors', () => {
      const validatorAlwaysTrue = () => ({
        alwaysTrue: true
      });

      const validatorAlwaysFalse = () => ({
        alwaysFalse: false
      });

      const group = initFormArray([
        ['', [validatorAlwaysTrue]],
        ['', [validatorAlwaysFalse]]
      ]);

      const expected = [
        {
          alwaysTrue: true
        },
        {
          alwaysFalse: false
        }
      ];

      const result = getFormArrayControlSummariesErrors(
        getFormArrayControlSummaries(group.controls)
      );

      expect(result).toEqual(expected);
    });
  });

  describe('getFormControlSummary', () => {
    [undefined, null, 0, { value: 'value' }].forEach(value => {
      it(`${value} match should return changed: false`, () => {
        const result = getFormControlSummary(initFormControl([value]));

        expect(result.changed).toEqual(false);
      });
    });

    it('should return changed: true for changed simple value', () => {
      const result = getFormControlSummary(
        initFormControl({
          value: 'value',
          initialValue: 'initialValue'
        })
      );

      expect(result.changed).toEqual(true);
    });

    it('should return changed: true for object key value change', () => {
      const result = getFormControlSummary(
        initFormControl({
          value: { deeper: { deep: 'value' } },
          initialValue: { deeper: { deep: 'initialValue' } }
        })
      );

      expect(result.changed).toEqual(true);
    });
  });

  describe('getFormControlSummary', () => {
    it('should returninvalid = false, errors = {}, controls for valid control', () => {
      const control: FormControlState<string> = {
        dirty: false,
        touched: false,
        value: '',
        initialValue: '',
        validators: [],
        disabled: false
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
        changed: false
      };

      const result = getFormControlSummary(control);

      expect(result).toEqual(expected);
    });

    it('should return invalid = true, errors = errors, controls for invalid control', () => {
      const error = {
        alwaysTrue: true
      };

      const validators = [() => error];

      const control: FormControlState<string> = {
        dirty: false,
        touched: false,
        value: '',
        initialValue: '',
        validators,
        disabled: false
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
        changed: false
      };

      const result = getFormControlSummary(control);

      expect(result).toEqual(expected);
    });

    it('should return invalid = true, errors = errors, controls for additional errors', () => {
      const additionalError = {
        additionalError: true
      };

      const control: FormControlState<string> = {
        dirty: false,
        touched: false,
        value: '',
        initialValue: '',
        validators: [],
        disabled: false
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
        changed: false
      };

      const result = getFormControlSummary(control, additionalError);

      expect(result).toEqual(expected);
    });

    it('should merge errors with additional errors', () => {
      const additionalError = {
        additionalError: true
      };

      const error = {
        alwaysTrue: true
      };

      const validators = [() => error];

      const control: FormControlState<string> = {
        dirty: false,
        touched: false,
        value: '',
        initialValue: '',
        validators,
        disabled: false
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
        changed: false
      };

      const result = getFormControlSummary(control, additionalError);

      expect(result).toEqual(expected);
    });
  });

  describe('getFormGroupPristine', () => {
    it('all controls dirty: false should return false', () => {
      const group = {
        controls: {
          c1: {
            dirty: false
          } as FormControlState<any>,
          c2: {
            dirty: false
          } as FormControlState<any>
        },
        validators: []
      } as FormGroupState<any>;

      const result = getFormGroupDirty(group);

      expect(result).toEqual(false);
    });

    it('one control dirty should return true', () => {
      const group = {
        controls: {
          c1: {
            dirty: false
          } as FormControlState<any>,
          c2: {
            dirty: true
          } as FormControlState<any>
        },
        validators: []
      } as FormGroupState<any>;

      const result = getFormGroupDirty(group);

      expect(result).toEqual(true);
    });
  });

  describe('getFormArrayDirty', () => {
    it('all controls dirty: false should return false', () => {
      const array = {
        controls: [
          {
            dirty: false
          } as FormControlState<any>,
          {
            dirty: false
          } as FormControlState<any>
        ],
        validators: []
      };

      const result = getFormArrayDirty(array);

      expect(result).toEqual(false);
    });

    it('one control dirty should return true', () => {
      const array = {
        controls: [
          {
            dirty: false
          } as FormControlState<any>,
          {
            dirty: true
          } as FormControlState<any>
        ],
        validators: []
      };

      const result = getFormArrayDirty(array);

      expect(result).toEqual(true);
    });
  });

  describe('getFormGroupTouched', () => {
    it('all controls touched should return true', () => {
      const group = {
        controls: {
          c1: {
            touched: true
          } as FormControlState<any>,
          c2: {
            touched: true
          } as FormControlState<any>
        },
        validators: []
      } as FormGroupState<any>;

      const result = getFormGroupTouched(group);

      expect(result).toEqual(true);
    });

    it('one control touched should return true', () => {
      const group = {
        controls: {
          c1: {
            touched: false
          } as FormControlState<any>,
          c2: {
            touched: true
          } as FormControlState<any>
        },
        validators: []
      } as FormGroupState<any>;

      const result = getFormGroupTouched(group);

      expect(result).toEqual(true);
    });
  });

  describe('getFormArrayTouched', () => {
    it('all controls touched should return true', () => {
      const array = {
        controls: [
          {
            touched: true
          } as FormControlState<any>,
          {
            touched: true
          } as FormControlState<any>
        ],
        validators: []
      };

      const result = getFormArrayTouched(array);

      expect(result).toEqual(true);
    });

    it('one control touched should return true', () => {
      const array = {
        controls: [
          {
            touched: false
          } as FormControlState<any>,
          {
            touched: true
          } as FormControlState<any>
        ],
        validators: []
      };

      const result = getFormArrayTouched(array);

      expect(result).toEqual(false);
    });
  });

  describe('getFormGroupChanged', () => {
    it('only initial values should return false', () => {
      const result = getFormGroupChanged({
        first: getFormControlSummary(initFormControl(['value'])),
        second: getFormControlSummary(initFormControl(['value']))
      });

      expect(result).toEqual(false);
    });

    it('one changed value should return true', () => {
      const result = getFormGroupChanged({
        first: getFormControlSummary(initFormControl(['value'])),
        second: getFormControlSummary(initFormControl({ value: 'value', initialValue: 'changed' }))
      });

      expect(result).toEqual(true);
    });

    it('all changed values should return true', () => {
      const result = getFormGroupChanged({
        first: getFormControlSummary(initFormControl({ value: 'value', initialValue: 'changed' })),
        second: getFormControlSummary(initFormControl({ value: 'value', initialValue: 'changed' }))
      });

      expect(result).toEqual(true);
    });
  });

  describe('getFormArrayChanged', () => {
    it('only initial values should return false', () => {
      const result = getFormArrayChanged([
        getFormControlSummary(initFormControl(['value'])),
        getFormControlSummary(initFormControl(['value']))
      ]);

      expect(result).toEqual(false);
    });

    it('one changed value should return true', () => {
      const result = getFormArrayChanged([
        getFormControlSummary(initFormControl(['value'])),
        getFormControlSummary(initFormControl({ value: 'value', initialValue: 'initialValue' }))
      ]);

      expect(result).toEqual(true);
    });

    it('all changed values should return true', () => {
      const result = getFormArrayChanged([
        getFormControlSummary(initFormControl({ value: 'value', initialValue: 'initialValue' })),
        getFormControlSummary(initFormControl({ value: 'value', initialValue: 'initialValue' }))
      ]);

      expect(result).toEqual(true);
    });
  });

  describe('getFormGroupSummary', () => {
    interface TestControls {
      stringControl: string;
    }

    it('all valid should return errors = {} &invalid = false', () => {
      const group = initFormGroup({
        c1: ['']
      });

      const result = getFormGroupSummary(group);

      expect(result.errors).toEqual({});
      expect(result.invalid).toEqual(false);
    });

    it('one error should return errors & invalid = true', () => {
      const error = {
        alwaysTrue: true
      };

      const group = initFormGroup({
        c1: ['', [() => error]],
        c2: ['']
      });

      const expected = {
        c1: error
      };

      const result = getFormGroupSummary(group);

      expect(result.errors).toEqual(expected);
      expect(result.invalid).toEqual(true);
    });

    it('should summarize with error for group + controls', () => {
      const group = initFormGroup<TestControls>({
        stringControl: [
          'initial',
          [
            () => ({
              controlError: true
            })
          ]
        ]
      });

      const additionalError: FormGroupErrors<TestControls> = {
        stringControl: {
          externalError: true
        }
      };

      const expected: FormGroupSummary<TestControls> = {
        controls: {
          stringControl: {
            value: 'initial',
            initialValue: 'initial',
            disabled: false,
            dirty: false,
            touched: false,
            invalid: true,
            validators: group.controls.stringControl.validators,
            errors: {
              externalError: true,
              controlError: true
            },
            changed: false
          }
        },
        errors: {
          stringControl: {
            externalError: true,
            controlError: true
          }
        },
        dirty: false,
        touched: false,
        invalid: true,
        changed: false,
        validators: []
      };

      const result = getFormGroupSummary(group, additionalError);

      expect(result).toEqual(expected);
    });

    it('should set valid on control & group accordingly - only additional error', () => {
      const group = initFormGroup<TestControls>({
        stringControl: ['initial']
      });

      const additionalError: FormGroupErrors<TestControls> = {
        stringControl: {
          externalError: true
        }
      };

      const expected: FormGroupSummary<TestControls> = {
        controls: {
          stringControl: {
            value: 'initial',
            initialValue: 'initial',
            disabled: false,
            dirty: false,
            touched: false,
            invalid: true,
            validators: group.controls.stringControl.validators,
            errors: {
              externalError: true
            },
            changed: false
          }
        },
        errors: {
          stringControl: {
            externalError: true
          }
        },
        dirty: false,
        touched: false,
        invalid: true,
        changed: false,
        validators: []
      };

      const result = getFormGroupSummary(group, additionalError);

      expect(result).toEqual(expected);
    });

    it('should set valid on control & group accordingly - only form error', () => {
      const group = initFormGroup<TestControls>({
        stringControl: [
          'initial',
          [
            () => ({
              stringError: true
            })
          ]
        ]
      });

      const expected: FormGroupSummary<TestControls> = {
        controls: {
          stringControl: {
            value: 'initial',
            initialValue: 'initial',
            disabled: false,
            dirty: false,
            touched: false,
            invalid: true,
            validators: group.controls.stringControl.validators,
            errors: {
              stringError: true
            },
            changed: false
          }
        },
        errors: {
          stringControl: {
            stringError: true
          }
        },
        dirty: false,
        touched: false,
        invalid: true,
        changed: false,
        validators: []
      };

      const result = getFormGroupSummary(group);

      expect(result).toEqual(expected);
    });

    it('should return summary on {} errors', () => {
      const group = initFormGroup<TestControls>({
        stringControl: ['initial']
      });

      const expected: FormGroupSummary<TestControls> = {
        controls: {
          stringControl: {
            value: 'initial',
            initialValue: 'initial',
            disabled: false,
            dirty: false,
            touched: false,
            invalid: false,
            validators: group.controls.stringControl.validators,
            errors: {},
            changed: false
          }
        },
        errors: {},
        dirty: false,
        touched: false,
        invalid: false,
        changed: false,
        validators: []
      };

      const result = getFormGroupSummary(group);

      expect(result).toEqual(expected);
    });

    it('should detect group validation errors', () => {
      const controlError = { controlError: true };
      const groupError = { groupError: true };

      const group = initFormGroup<TestControls>(
        {
          stringControl: ['initial', [() => controlError]]
        },
        [() => ({ stringControl: groupError })]
      );

      const result = getFormGroupSummary(group);
      const expectedErrors: FormGroupErrors<TestControls> = {
        stringControl: {
          controlError: true,
          groupError: true
        }
      };

      expect(result.errors).toEqual(expectedErrors);
      expect(result.controls.stringControl.errors).toEqual(expectedErrors.stringControl);
    });
  });

  describe('getFormArraySummary', () => {
    it('all valid should return errors = [{}] &invalid = false', () => {
      const array = initFormArray([['']]);

      const result = getFormArraySummary(array);

      expect(result.errors).toEqual([{}]);
      expect(result.invalid).toEqual(false);
    });

    it('one error should return errors & invalid = true', () => {
      const error = {
        alwaysTrue: true
      };

      const array = initFormArray([[''], ['', [() => error]], ['']]);

      const expected = [{}, error, {}];

      const result = getFormArraySummary(array);

      expect(result.errors).toEqual(expected);
      expect(result.invalid).toEqual(true);
    });

    it('should summarize with error for array + controls', () => {
      const validator = () => ({
        controlError: true
      });

      const arrayValidator: ArrayValidator<string> = () => [{ firstEntryError: true }];

      const array = initFormArray([['initial', [validator]]], [arrayValidator]);

      const additionalError: FormArrayErrors = [
        {
          externalError: true
        }
      ];

      const expected: FormArraySummary<string> = {
        controls: [
          {
            value: 'initial',
            initialValue: 'initial',
            disabled: false,
            dirty: false,
            touched: false,
            invalid: true,
            validators: array.controls[0].validators,
            errors: {
              externalError: true,
              controlError: true,
              firstEntryError: true
            },
            changed: false
          }
        ],
        keys: [0],
        errors: [
          {
            externalError: true,
            controlError: true,
            firstEntryError: true
          }
        ],
        dirty: false,
        touched: false,
        invalid: true,
        changed: false,
        validators: [arrayValidator]
      };

      const result = getFormArraySummary(array, additionalError);

      expect(result).toEqual(expected);
    });

    it('should set valid on control & array accordingly - only additional error', () => {
      const array = initFormArray([['initial']]);

      const additionalError: FormArrayErrors = [
        {
          externalError: true
        }
      ];

      const expected: FormArraySummary<string> = {
        controls: [
          {
            value: 'initial',
            initialValue: 'initial',
            disabled: false,
            dirty: false,
            touched: false,
            invalid: true,
            validators: array.controls[0].validators,
            errors: {
              externalError: true
            },
            changed: false
          }
        ],
        keys: [0],
        errors: [
          {
            externalError: true
          }
        ],
        dirty: false,
        touched: false,
        invalid: true,
        changed: false,
        validators: []
      };

      const result = getFormArraySummary(array, additionalError);

      expect(result).toEqual(expected);
    });

    it('should set valid on control & array accordingly - only form error', () => {
      const validator = () => ({
        stringError: true
      });

      const array = initFormArray([['initial', [validator]]]);

      const expected: FormArraySummary<string> = {
        controls: [
          {
            value: 'initial',
            initialValue: 'initial',
            disabled: false,
            dirty: false,
            touched: false,
            invalid: true,
            validators: array.controls[0].validators,
            errors: {
              stringError: true
            },
            changed: false
          }
        ],
        keys: [0],
        errors: [
          {
            stringError: true
          }
        ],
        dirty: false,
        touched: false,
        invalid: true,
        changed: false,
        validators: []
      };

      const result = getFormArraySummary(array);

      expect(result).toEqual(expected);
    });

    it('should return summary on {} errors', () => {
      const array = initFormArray([['initial']]);

      const expected: FormArraySummary<string> = {
        controls: [
          {
            value: 'initial',
            initialValue: 'initial',
            disabled: false,
            dirty: false,
            touched: false,
            invalid: false,
            validators: array.controls[0].validators,
            errors: {},
            changed: false
          }
        ],
        keys: [0],
        errors: [{}],
        dirty: false,
        touched: false,
        invalid: false,
        changed: false,
        validators: []
      };

      const result = getFormArraySummary(array);

      expect(result).toEqual(expected);
    });
  });
});
