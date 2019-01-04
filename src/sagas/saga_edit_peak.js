import { put, takeEvery, select } from 'redux-saga/effects';

import { EDITPEAK, SHIFT } from '../constants/action_type';
import { LIST_MODE } from '../constants/list_mode';
import { FromManualToOffset } from '../helpers/shift';

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

function* addVirtualFactor(action) {
  const origRef = yield select(getShiftRef);
  const origApex = yield select(getShiftPeak);
  const { payload } = action;

  const absOffset = FromManualToOffset(origRef, origApex);
  yield put({
    type: EDITPEAK.SHIFT,
    payload: Object.assign({}, payload, { absOffset }),
  });
}

const editPeakSagas = [
  takeEvery(EDITPEAK.CLICK_POINT, updateEditPeakByMode),
  takeEvery(SHIFT.SET_REF, addVirtualFactor),
  takeEvery(SHIFT.SET_PEAK, addVirtualFactor),
];

export default editPeakSagas;
