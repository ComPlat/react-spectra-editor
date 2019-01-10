import { put, takeEvery, select } from 'redux-saga/effects';

import { EDITPEAK, SHIFT, BORDER } from '../constants/action_type';
import { LIST_MODE } from '../constants/list_mode';
import { FromManualToOffset, VirtalPts } from '../helpers/shift';

const getModeEdit = state => state.mode.edit;

function* updateEditPeakByMode(action) {
  const { payload, onPeak } = action;
  const modeEdit = yield select(getModeEdit);

  if (modeEdit === LIST_MODE.ADD_PEAK && !onPeak) {
    yield put({
      type: EDITPEAK.ADD_POSITIVE,
      payload,
    });
  } else if (modeEdit === LIST_MODE.RM_PEAK && onPeak) {
    yield put({
      type: EDITPEAK.ADD_NEGATIVE,
      payload,
    });
  } else if (modeEdit === LIST_MODE.ANCHOR_SHIFT && onPeak) {
    yield put({
      type: SHIFT.SET_PEAK,
      payload,
    });
  }
}

const getShiftRef = state => state.shift.ref;
const getShiftPeak = state => state.shift.peak;
const getEditPeak = state => state.editPeak;

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
  yield put({
    type: BORDER.UPDATE,
    payload: [],
  });
}

const editPeakSagas = [
  takeEvery(EDITPEAK.CLICK_POINT, updateEditPeakByMode),
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
