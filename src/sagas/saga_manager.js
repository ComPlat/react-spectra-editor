import { put, takeEvery, select } from 'redux-saga/effects';

import {
  MANAGER, INTEGRATION, SIMULATION,
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
  const { integration, simulation } = action.payload;

  if (integration) {
    yield put({
      type: INTEGRATION.RESET_ALL_RDC,
      payload: integration,
    });
  }
  if (simulation) {
    yield put({
      type: SIMULATION.RESET_ALL_RDC,
      payload: simulation,
    });
  }
}

function* resetInitCommonWithIntergation(action) {
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
  takeEvery(MANAGER.RESET_INIT_COMMON_WITH_INTERGATION, resetInitCommonWithIntergation),
];

export default managerSagas;
