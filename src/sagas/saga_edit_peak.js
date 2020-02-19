import { put, takeEvery, select } from 'redux-saga/effects';

import { EDITPEAK, SHIFT } from '../constants/action_type';
import { FromManualToOffset, VirtalPts } from '../helpers/shift';

const getShiftRef = state => state.shift.ref;
const getShiftPeak = state => state.shift.peak;
const getEditPeak = state => state.editPeak.present;

function* addVirtualFactor(action) {
  const origRef = yield select(getShiftRef);
  const origApex = yield select(getShiftPeak);
  const origEPeak = yield select(getEditPeak);
  const { payload } = action;

  const { prevOffset, pos, neg } = origEPeak;
  const absOffset = FromManualToOffset(origRef, origApex);
  const relOffset = prevOffset - absOffset;
  const nextPos = VirtalPts(pos, relOffset);
  const nextNeg = VirtalPts(neg, relOffset);

  yield put({
    type: EDITPEAK.SHIFT,
    payload: Object.assign({}, payload, {
      prevOffset: absOffset,
      pos: nextPos,
      neg: nextNeg,
    }),
  });
}

const editPeakSagas = [
  takeEvery(SHIFT.SET_REF, addVirtualFactor),
  takeEvery(SHIFT.SET_PEAK, addVirtualFactor),
];

export default editPeakSagas;

/* LOGIC
                                      -no        po - tg
  | picked | another | absoffset | prevOffset | relative | newOffset
-------------------------------------------------------------------
0 |   40        20          -           -            -          0
1 |  180       160       -140           0          140        140
2 |   80        60        -40        -140         -100        100
3 |   20         0        +20        -100         -120
-------------------------------------------------------------------

*/
