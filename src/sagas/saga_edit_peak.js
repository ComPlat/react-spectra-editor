import { put, takeEvery, select } from 'redux-saga/effects';

import { EDITPEAK, SHIFT } from '../constants/action_type';
import { FromManualToOffset, VirtalPts } from '../helpers/shift';
import { LIST_SHIFT_1H } from '../constants/list_shift';

const getShift = state => state.shift;
const getEditPeak = state => state.editPeak.present;

function* addVirtualFactor(action) {
  const originShift = yield select(getShift);
  const origEPeak = yield select(getEditPeak);
  const { payload } = action;

  const { curveIdx } = payload;
  const { peaks } = origEPeak;
  let currentOriginPeaks = peaks[curveIdx];
  if (currentOriginPeaks === false || currentOriginPeaks === undefined) {
    currentOriginPeaks = {
      prevOffset: 0,
      pos: [],
      neg: [],
    };
  }

  let currentOriginShift = originShift[curveIdx];
  if (currentOriginShift === false || currentOriginShift === undefined) {
    const shiftNone = LIST_SHIFT_1H[0];
    currentOriginShift = {
      ref: shiftNone,
      peak: false,
      enable: true,
    };
  }

  const origRef = currentOriginShift.ref;
  const origApex = currentOriginShift.peak;

  const { prevOffset, pos, neg } = currentOriginPeaks;
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
