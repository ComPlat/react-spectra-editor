import { put, takeEvery, select } from 'redux-saga/effects';

import { MANAGER } from '../constants/action_type';


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

const managerSagas = [
  takeEvery(MANAGER.RESETALL, resetShift),
];

export default managerSagas;
