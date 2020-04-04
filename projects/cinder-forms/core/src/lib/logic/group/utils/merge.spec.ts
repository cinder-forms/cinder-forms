import { selectGroup } from "../select";
import { initGroup } from "../state/init"
import { GroupErrors } from "../state/types";
import { mergeGroupErrors } from "./merge"

describe('mergeGroupErrors', () => {
  it('should merge not overriding controls', () => {
    const e1: GroupErrors = {
      stringControl: {
        firstError: 'firstError'
      }
    };

    const e2: GroupErrors = {
      numberControl: {
        secondError: 'secondError'
      }
    };

    const expected: GroupErrors = {
      stringControl: {
        firstError: 'firstError'
      },
      numberControl: {
        secondError: 'secondError'
      }
    };

    const result = mergeGroupErrors(e1, e2);

    expect(result).toEqual(expected);
  });

  it('should merge overriding controls + different attributes', () => {
    const e1: GroupErrors = {
      stringControl: {
        firstError: 'firstError'
      }
    };

    const e2: GroupErrors = {
      stringControl: {
        secondError: 'secondError'
      }
    };

    const expected: GroupErrors = {
      stringControl: {
        firstError: 'firstError',
        secondError: 'secondError'
      }
    };

    const result = mergeGroupErrors(e1, e2);

    expect(result).toEqual(expected);
  });

  it('should merge overriding controls + overriding attributes, choose last', () => {
    const e1: GroupErrors = {
      stringControl: {
        firstError: 'firstError',
        duplicateError: 'error1'
      }
    };

    const e2: GroupErrors = {
      stringControl: {
        secondError: 'secondError',
        duplicateError: 'error2'
      }
    };

    const expected: GroupErrors = {
      stringControl: {
        firstError: 'firstError',
        secondError: 'secondError',
        duplicateError: 'error2'
      }
    };

    const result = mergeGroupErrors(e1, e2);

    expect(result).toEqual(expected);
  });

  it('should merge 3+ controls', () => {
    const e1: GroupErrors = {
      stringControl: {
        firstError: 'firstError'
      },
      numberControl: {
        otherError: 'otherError'
      }
    };

    const e2: GroupErrors = {
      stringControl: {
        secondError: 'secondError'
      }
    };

    const e3: GroupErrors = {
      stringControl: {
        thirdError: 'thirdError'
      }
    };

    const e4: GroupErrors = {
      numberControl: {
        fourthError: 'fourthError'
      }
    };

    const expected: GroupErrors = {
      stringControl: {
        firstError: 'firstError',
        secondError: 'secondError',
        thirdError: 'thirdError'
      },
      numberControl: {
        fourthError: 'fourthError',
        otherError: 'otherError'
      }
    };

    const result = mergeGroupErrors(e1, e2, e3, e4);

    expect(result).toEqual(expected);
  });

  it('should return {} on all inputs {}', () => {
    const result = mergeGroupErrors({}, {});

    expect(result).toEqual({});
  });

  it('should return first error on merge first error, second {}', () => {
    const e1: GroupErrors = {
      stringControl: {
        firstError: 'firstError'
      }
    };

    const result = mergeGroupErrors(e1, {});

    expect(result).toEqual(e1);
  });

  it('should return second error on merge first {}, second error', () => {
    const e2: GroupErrors = {
      stringControl: {
        firstError: 'firstError'
      }
    };

    const result = mergeGroupErrors({}, e2);

    expect(result).toEqual(e2);
  });

  it('should return {} on {}', () => {
    const result = mergeGroupErrors({});

    expect(result).toEqual({});
  });

  it('typing should work', () => {
    const someObj1 = {
      someAttr: 7
    }

    const someObj2 = {
      someAttr: 'S'
    }

    const errors1 = selectGroup(initGroup({
      test: ['test', [() => ({test1: someObj1})]]
    })).errors;

    const errors2 = selectGroup(initGroup({
      test: ['test', [() => ({test2: someObj2})]]
    })).errors;

    // type check
      const errors = mergeGroupErrors(errors1, errors2);

    errors.test = errors1.test;
    errors.test = errors2.test;
    let error1 = errors1.test.test1;
    error1 = errors.test.test1;
    let error2 = errors2.test.test2;
    error2 = errors.test.test2;

    // expect to compile
    expect(errors).toBeDefined();
  })
});
