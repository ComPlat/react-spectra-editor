import { put, takeEvery, select } from 'redux-saga/effects';

import {
  MANAGER, INTEGRATION, SIMULATION,
} from '../constants/action_type';

const getLayout = (state) => state.layout;
const getCurveSt = (state) => state.curve;
const getIntegrationSt = (state) => state.integration.present;

function* resetShift(action) {
  const curveSt = yield select(getCurveSt);
  const layout = yield select(getLayout);

  const { payload } = action;

  const { curveIdx, listCurves } = curveSt;

  const numberOfCurve = listCurves.length;

  yield put({
    type: MANAGER.RESETSHIFT,
    payload: Object.assign( // eslint-disable-line
      {},
      payload,
      {
        layout,
        curvesInfo: {
          isMultiCurve: numberOfCurve > 0,
          curveIdx,
          numberOfCurve,
        },
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

  const payload = Object.assign({}, integationSt, { integrations, selectedIdx: curveIdx }); // eslint-disable-line

  if (integration) {
    yield put({
      type: INTEGRATION.RESET_ALL_RDC,
      payload,
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

  const payload = Object.assign({}, integationSt, { integrations, selectedIdx: curveIdx }); // eslint-disable-line

  if (integration) {
    yield put({
      type: INTEGRATION.RESET_ALL_RDC,
      payload,
    });
  }
}

const managerSagas = [
  takeEvery(MANAGER.RESETALL, resetShift),
  takeEvery(MANAGER.RESET_INIT_NMR, resetInitNmr),
  takeEvery(MANAGER.RESET_INIT_COMMON_WITH_INTERGATION, resetInitCommonWithIntergation),
];

export default managerSagas;
