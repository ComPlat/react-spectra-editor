import { put, takeEvery, select } from 'redux-saga/effects';

import {
  MANAGER, INTEGRATION, SIMULATION,
} from '../constants/action_type';

const getLayout = (state) => state.layout;
const getCurveSt = (state) => state.curve;
const getIntegrationSt = (state) => state.integration.present;

const defaultEmptyIntegration = {
  stack: [],
  refArea: 1,
  refFactor: 1,
  shift: 0,
  edited: false,
};

function* resetShift(action) {
  const curveSt = yield select(getCurveSt);
  const layout = yield select(getLayout);

  const { payload } = action;

  const { curveIdx, listCurves } = curveSt;

  const numberOfCurve = Array.isArray(listCurves) ? listCurves.length : 0;

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
  // Always reset: keeping the previous spectrum's integrations would
  // display stale data when the new entity has none saved.
  const newArrIntegration = new Array(curveIdx + 1).fill(defaultEmptyIntegration);
  newArrIntegration[curveIdx] = integration || defaultEmptyIntegration;

  const payload = Object.assign({}, integationSt, { integrations: newArrIntegration, selectedIdx: curveIdx }); // eslint-disable-line

  yield put({
    type: INTEGRATION.RESET_ALL_RDC,
    payload,
  });
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

  const newArrIntegration = new Array(curveIdx + 1).fill(defaultEmptyIntegration);
  newArrIntegration[curveIdx] = integration || defaultEmptyIntegration;

  const payload = Object.assign({}, integationSt, { integrations: newArrIntegration, selectedIdx: curveIdx }); // eslint-disable-line

  yield put({
    type: INTEGRATION.RESET_ALL_RDC,
    payload,
  });
}

const managerSagas = [
  takeEvery(MANAGER.RESETALL, resetShift),
  takeEvery(MANAGER.RESET_INIT_NMR, resetInitNmr),
  takeEvery(MANAGER.RESET_INIT_COMMON_WITH_INTERGATION, resetInitCommonWithIntergation),
];

export default managerSagas;
