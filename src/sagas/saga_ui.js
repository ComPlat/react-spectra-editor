import { put, takeEvery, select } from 'redux-saga/effects';

import {
  UI, EDITPEAK, SHIFT, INTEGRATION, MULTIPLICITY, CYCLIC_VOLTA_METRY,
} from '../constants/action_type';
import { LIST_UI_SWEEP_TYPE } from '../constants/list_ui';
import { LIST_LAYOUT } from '../constants/list_layout';

const getUiSt = (state) => state.ui;
const getCurveSt = (state) => state.curve;

const calcPeaks = (payload) => {
  const { xExtent, yExtent, dataPks } = payload;
  if (!dataPks) return [];
  const { xL, xU } = xExtent;
  const { yL, yU } = yExtent;
  const peaks = dataPks.filter((p) => xL <= p.x && p.x <= xU && yL <= p.y && p.y <= yU);
  return peaks;
};

function* selectUiSweep(action) {
  const uiSt = yield select(getUiSt);
  const { payload } = action;

  const curveSt = yield select(getCurveSt);
  const { curveIdx } = curveSt;

  switch (uiSt.sweepType) {
    case LIST_UI_SWEEP_TYPE.ZOOMIN:
      yield put({
        type: UI.SWEEP.SELECT_ZOOMIN,
        payload,
      });
      break;
    case LIST_UI_SWEEP_TYPE.ZOOMRESET:
      yield put({
        type: UI.SWEEP.SELECT_ZOOMRESET,
        payload,
      });
      break;
    case LIST_UI_SWEEP_TYPE.INTEGRATION_ADD:
      yield put({
        type: UI.SWEEP.SELECT_INTEGRATION,
        payload: { newData: payload, curveIdx },
      });
      break;
    case LIST_UI_SWEEP_TYPE.MULTIPLICITY_SWEEP_ADD:
      const peaks = calcPeaks(payload); // eslint-disable-line
      if (peaks.length === 0) { break; }
      const newPayload = Object.assign({}, payload, { peaks }); // eslint-disable-line

      yield put({
        type: UI.SWEEP.SELECT_INTEGRATION,
        payload: { newData: newPayload, curveIdx },
      });
      yield put({
        type: UI.SWEEP.SELECT_MULTIPLICITY,
        payload: { newData: newPayload, curveIdx },
      });
      break;
    default:
      break;
  }
  return null;
}

const getLayoutSt = (state) => state.layout;

function* scrollUiWheel(action) {
  const layoutSt = yield select(getLayoutSt);
  const { payload } = action;
  const { xExtent, yExtent, direction } = payload;
  const { yL, yU } = yExtent;
  const [yeL, yeU] = [yL + (yU - yL) * 0.1, yU - (yU - yL) * 0.1];
  const scale = direction ? 0.8 : 1.25;
  let nextExtent = { xExtent: false, yExtent: false };
  let [nyeL, nyeU, h, nytL, nytU] = [0, 1, 1, 0, 1];

  switch (layoutSt) {
    case LIST_LAYOUT.IR:
    case LIST_LAYOUT.RAMAN:
      [nyeL, nyeU] = [yeL + (yeU - yeL) * (1 - scale), yeU];
      h = nyeU - nyeL;
      [nytL, nytU] = [nyeL - 0.125 * h, nyeU + 0.125 * h];
      nextExtent = { xExtent, yExtent: { yL: nytL, yU: nytU } };
      break;
    case LIST_LAYOUT.MS:
      [nyeL, nyeU] = [0, yeL + (yeU - yeL) * scale];
      h = nyeU - nyeL;
      [nytL, nytU] = [nyeL - 0.125 * h, nyeU + 0.125 * h];
      nextExtent = { xExtent, yExtent: { yL: nytL, yU: nytU } };
      break;
    case LIST_LAYOUT.UVVIS:
    case LIST_LAYOUT.HPLC_UVVIS:
    case LIST_LAYOUT.TGA:
    case LIST_LAYOUT.DSC:
    case LIST_LAYOUT.XRD:
    default:
      [nyeL, nyeU] = [yeL, yeL + (yeU - yeL) * scale];
      h = nyeU - nyeL;
      [nytL, nytU] = [nyeL - 0.125 * h, nyeU + 0.125 * h];
      nextExtent = { xExtent, yExtent: { yL: nytL, yU: nytU } };
      break;
  }
  yield put({
    type: UI.SWEEP.SELECT_ZOOMIN,
    payload: nextExtent,
  });
}

const getUiSweepType = (state) => state.ui.sweepType;

function* clickUiTarget(action) {
  const {
    payload, onPeak, voltammetryPeakIdx, onPecker,
  } = action;
  const uiSweepType = yield select(getUiSweepType);

  const curveSt = yield select(getCurveSt);
  const { curveIdx } = curveSt;

  if (uiSweepType === LIST_UI_SWEEP_TYPE.PEAK_ADD && !onPeak) {
    yield put({
      type: EDITPEAK.ADD_POSITIVE,
      payload: { dataToAdd: payload, curveIdx },
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.PEAK_DELETE && onPeak) {
    yield put({
      type: EDITPEAK.ADD_NEGATIVE,
      payload: { dataToAdd: payload, curveIdx },
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT && onPeak) {
    yield put({
      type: SHIFT.SET_PEAK,
      payload: { dataToSet: payload, curveIdx },
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_RM && onPeak) {
    yield put({
      type: INTEGRATION.RM_ONE,
      payload: { dataToRemove: payload, curveIdx },
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_RM && onPeak) {
    yield put({
      type: INTEGRATION.RM_ONE,
      payload: { dataToRemove: payload, curveIdx },
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF && onPeak) {
    yield put({
      type: INTEGRATION.SET_REF,
      payload: { refData: payload, curveIdx },
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_CLICK && onPeak) {
    const { xExtent, xL, xU } = payload;
    if (xExtent) {
      yield put({
        type: MULTIPLICITY.ONE_CLICK_BY_UI,
        payload: { payloadData: xExtent, curveIdx },
      });
    } else if (xL && xU) {
      yield put({
        type: MULTIPLICITY.ONE_CLICK_BY_UI,
        payload: { payloadData: { xL, xU }, curveIdx },
      });
    }
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_ADD) {
    yield put({
      type: MULTIPLICITY.PEAK_ADD_BY_UI_SAG,
      payload,
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_RM && onPeak) {
    yield put({
      type: MULTIPLICITY.PEAK_RM_BY_UI,
      payload,
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MAX_PEAK && !onPeak) {
    yield put({
      type: CYCLIC_VOLTA_METRY.ADD_MAX_PEAK,
      payload: { peak: payload, index: voltammetryPeakIdx, jcampIdx: curveIdx },
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MAX_PEAK && onPeak) {
    yield put({
      type: CYCLIC_VOLTA_METRY.REMOVE_MAX_PEAK,
      payload: { index: voltammetryPeakIdx, jcampIdx: curveIdx },
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MIN_PEAK && !onPeak) {
    yield put({
      type: CYCLIC_VOLTA_METRY.ADD_MIN_PEAK,
      payload: { peak: payload, index: voltammetryPeakIdx, jcampIdx: curveIdx },
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MIN_PEAK && onPeak) {
    yield put({
      type: CYCLIC_VOLTA_METRY.REMOVE_MIN_PEAK,
      payload: { index: voltammetryPeakIdx, jcampIdx: curveIdx },
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_PECKER && !onPecker) {
    yield put({
      type: CYCLIC_VOLTA_METRY.ADD_PECKER,
      payload: { peak: payload, index: voltammetryPeakIdx, jcampIdx: curveIdx },
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_PECKER && onPecker) {
    yield put({
      type: CYCLIC_VOLTA_METRY.REMOVE_PECKER,
      payload: { index: voltammetryPeakIdx, jcampIdx: curveIdx },
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_SET_REF && onPeak) {
    yield put({
      type: CYCLIC_VOLTA_METRY.SET_REF,
      payload: { index: voltammetryPeakIdx, jcampIdx: curveIdx },
    });
  }
}

const managerSagas = [
  takeEvery(UI.CLICK_TARGET, clickUiTarget),
  takeEvery(UI.SWEEP.SELECT, selectUiSweep),
  takeEvery(UI.WHEEL.SCROLL, scrollUiWheel),
];

export default managerSagas;
