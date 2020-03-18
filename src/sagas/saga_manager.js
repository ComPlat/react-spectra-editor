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

function* resetInitNmr(action) {
  const { integration } = action.payload;

  if (integration) {
    yield put({
      type: INTEGRATION.RESET_ALL_RDC,
      payload: integration,
    });
  }
}

const managerSagas = [
  takeEvery(MANAGER.RESETALL, resetShift),
  takeEvery(MANAGER.RESET_INIT_NMR, resetInitNmr),
];

export default managerSagas;
