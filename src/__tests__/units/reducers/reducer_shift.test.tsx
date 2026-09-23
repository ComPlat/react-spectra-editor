import shiftReducer from "../../../reducers/reducer_shift";
import { MANAGER } from "../../../constants/action_type";
import { LIST_LAYOUT } from "../../../constants/list_layout";
import { LIST_SHIFT_1H } from "../../../constants/list_shift";

describe('Test redux shift reducer', () => {
  const resetShiftAction = (solventName: string) => ({
    type: MANAGER.RESETSHIFT,
    payload: {
      shift: { solventName, solventValue: 7.26 },
      layout: LIST_LAYOUT.H1,
      operation: { typ: 'NMR' },
      curvesInfo: { isMultiCurve: true, curveIdx: 1, numberOfCurve: 2 },
    },
  });

  it('Falls back to the empty reference for an unknown solvent', () => {
    const state = { selectedIdx: 0, shifts: [{ ref: LIST_SHIFT_1H[0], peak: false, enable: true }] };
    const newState = shiftReducer(state, resetShiftAction('not-a-solvent'));
    expect(newState.shifts[1].ref).toEqual(LIST_SHIFT_1H[0]);
  });

  it('Resolves a known solvent by name', () => {
    const known = LIST_SHIFT_1H[1];
    const state = { selectedIdx: 0, shifts: [{ ref: LIST_SHIFT_1H[0], peak: false, enable: true }] };
    const newState = shiftReducer(state, resetShiftAction(known.name));
    expect(newState.shifts[1].ref).toEqual(known);
  });
});

describe('Test shift reducer across nuclei', () => {
  it('Keeps a 13C solvent when resolved against the 13C layout', () => {
    const state = { selectedIdx: 0, shifts: [{ ref: LIST_SHIFT_1H[0], peak: false, enable: true }] };
    const payload = (layout: string) => ({
      shift: { solventName: 'DMSO-d6', solventValue: 39.51 },
      layout,
      operation: { typ: 'NMR', layout: LIST_LAYOUT.C13 },
      curvesInfo: { isMultiCurve: true, curveIdx: 0, numberOfCurve: 1 },
    });
    const as13C = shiftReducer(state, { type: MANAGER.RESETSHIFT, payload: payload(LIST_LAYOUT.C13) });
    expect(as13C.shifts[0].ref.name).toEqual('DMSO-d6');
    const as1H = shiftReducer(state, { type: MANAGER.RESETSHIFT, payload: payload(LIST_LAYOUT.H1) });
    expect(as1H.shifts[0].ref).toEqual(LIST_SHIFT_1H[0]);
  });
});
