import { put, takeEvery, select } from 'redux-saga/effects';

import {
  MANAGER, INTEGRATION, SIMULATION,
} from '../constants/action_type';


const getLayout = state => state.layout;
const getCurveSt = state => state.curve;
const getIntegrationSt = state => state.integration.present;
const getShiftSt = state => state.shift;

function* resetShift(action) {
  const curveSt = yield select(getCurveSt);
  const layout = yield select(getLayout);
  const shiftSt = yield select(getShiftSt);

  const { payload } = action;
  // const { shift } = payload;
  // console.log(payload);
  // console.log(shiftSt);
  // const { curveIdx } = curveSt;
  // const { shifts } = shiftSt;
  // shifts[curveIdx] = shift;

  // const newPayload = Object.assign({}, shiftSt, { shifts, selectedIdx: curveIdx })

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
  const curveSt = yield select(getCurveSt);
  const integationSt = yield select(getIntegrationSt);
  const { curveIdx } = curveSt;

  const { integration, simulation } = action.payload;
  const { integrations } = integationSt;
  integrations[curveIdx] = integration;

  const payload = Object.assign({}, integationSt, { integrations, selectedIdx: curveIdx })

  if (integration) {
    yield put({
      type: INTEGRATION.RESET_ALL_RDC,
      payload: payload,
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
  const curveSt = yield select(getCurveSt);
  const integationSt = yield select(getIntegrationSt);
  const { curveIdx } = curveSt;

  const { integration } = action.payload;

  const { integrations } = integationSt;
  integrations[curveIdx] = integration;

  const payload = Object.assign({}, integationSt, { integrations, selectedIdx: curveIdx })

  if (integration) {
    yield put({
      type: INTEGRATION.RESET_ALL_RDC,
      payload: payload,
    });
  }
}

const managerSagas = [
  takeEvery(MANAGER.RESETALL, resetShift),
  takeEvery(MANAGER.RESET_INIT_NMR, resetInitNmr),
  takeEvery(MANAGER.RESET_INIT_COMMON_WITH_INTERGATION, resetInitCommonWithIntergation),
];

export default managerSagas;
