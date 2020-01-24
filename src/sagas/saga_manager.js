import { put, takeEvery, select } from 'redux-saga/effects';

import {
  MANAGER, INTEGRATION, MULTIPLICITY,
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
  const { integration, multiplicity } = action.payload;

  if (integration) {
    yield put({
      type: INTEGRATION.RESET_ALL,
      payload: integration,
    });
  }
  if (multiplicity) {
    yield put({
      type: MULTIPLICITY.RESET_ALL,
      payload: multiplicity,
    });
  }
}

const managerSagas = [
  takeEvery(MANAGER.RESETALL, resetShift),
  takeEvery(MANAGER.RESETPARAMSALL, resetParamsAll),
];

export default managerSagas;
