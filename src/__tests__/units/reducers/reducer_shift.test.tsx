import shiftReducer from "../../../reducers/reducer_shift";
import { MANAGER } from "../../../constants/action_type";

describe('Test redux reducer for shift', () => {
  it('Reset shift does not throw when payload.operation is missing (issue #329)', () => {
    const state = {
      selectedIdx: 0,
      shifts: [{ ref: false, peak: false, enable: true }],
    };
    const action = {
      type: MANAGER.RESETSHIFT,
      payload: {
        layout: '13C',
        curvesInfo: { isMultiCurve: false, curveIdx: 0, numberOfCurve: 0 },
      },
    };

    expect(() => shiftReducer(state, action)).not.toThrow();
    const newState: any = shiftReducer(state, action);
    expect(newState.shifts[0].enable).toEqual(false);
  });

  it('Reset shift enables NMR shift when payload.operation.typ is NMR', () => {
    const state = {
      selectedIdx: 0,
      shifts: [{ ref: false, peak: false, enable: false }],
    };
    const action = {
      type: MANAGER.RESETSHIFT,
      payload: {
        layout: '13C',
        operation: { typ: 'NMR' },
        curvesInfo: { isMultiCurve: false, curveIdx: 0, numberOfCurve: 0 },
      },
    };

    const newState: any = shiftReducer(state, action);
    expect(newState.shifts[0].enable).toEqual(true);
  });
})
