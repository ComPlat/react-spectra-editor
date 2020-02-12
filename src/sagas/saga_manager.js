import { put, takeEvery, select } from 'redux-saga/effects';

import {
  MANAGER, INTEGRATION,
} from '../constants/action_type';


const getLayout = state => state.layout;

function* resetShift(action) {
  const layout = yield select(getLayout);
  const { payload } = action;

  yield put({
    type: MANAGER.RESETSHIFT,
    payload: Object.assign(
      {},
      payload,
      {
        layout,
      },
    ),
  });
}

function* resetParamsAll(action) {
  const { integration } = action.payload;

  if (integration) {
    yield put({
      type: INTEGRATION.RESET_ALL,
      payload: integration,
    });
  }
}

const managerSagas = [
  takeEvery(MANAGER.RESETALL, resetShift),
  takeEvery(MANAGER.RESETPARAMSALL, resetParamsAll),
];

export default managerSagas;
