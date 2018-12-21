import { put, takeEvery, select } from 'redux-saga/effects';

import { EDITPEAK, SHIFT } from '../constants/action_type';
import { LIST_MODE } from '../constants/list_mode';

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

const editPeakSagas = [
  takeEvery(EDITPEAK.CLICK_POINT, updateEditPeakByMode),
];

export default editPeakSagas;
