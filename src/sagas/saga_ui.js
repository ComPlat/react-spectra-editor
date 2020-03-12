import { put, takeEvery, select } from 'redux-saga/effects';

import {
  UI, EDITPEAK, SHIFT, INTEGRATION, MULTIPLICITY,
} from '../constants/action_type';
import { LIST_UI_SWEEP_TYPE } from '../constants/list_ui';
import { LIST_LAYOUT } from '../constants/list_layout';

const getUiSt = state => state.ui;

const calcPeaks = (payload) => {
  const { xExtent, yExtent, dataPks } = payload;
  if (!dataPks) return [];
  const { xL, xU } = xExtent;
  const { yL, yU } = yExtent;
  const peaks = dataPks.filter(p => xL <= p.x && p.x <= xU && yL <= p.y && p.y <= yU);
  return peaks;
};

function* selectUiSweep(action) {
  const uiSt = yield select(getUiSt);
  const { payload } = action;

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
        payload,
      });
      break;
    case LIST_UI_SWEEP_TYPE.MULTIPLICITY_SWEEP_ADD:
      const peaks = calcPeaks(payload); // eslint-disable-line
      if (peaks.length === 0) { break; }
      const newPayload = Object.assign({}, payload, { peaks }); // eslint-disable-line

      yield put({
        type: UI.SWEEP.SELECT_INTEGRATION,
        payload: newPayload,
      });
      yield put({
        type: UI.SWEEP.SELECT_MULTIPLICITY,
        payload: newPayload,
      });
      break;
    default:
      break;
  }
  return null;
}

const getLayoutSt = state => state.layout;

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

const getUiSweepType = state => state.ui.sweepType;

function* clickUiTarget(action) {
  const { payload, onPeak } = action;
  const uiSweepType = yield select(getUiSweepType);

  if (uiSweepType === LIST_UI_SWEEP_TYPE.PEAK_ADD && !onPeak) {
    yield put({
      type: EDITPEAK.ADD_POSITIVE,
      payload,
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.PEAK_DELETE && onPeak) {
    yield put({
      type: EDITPEAK.ADD_NEGATIVE,
      payload,
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT && onPeak) {
    yield put({
      type: SHIFT.SET_PEAK,
      payload,
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_RM && onPeak) {
    yield put({
      type: INTEGRATION.RM_ONE,
      payload,
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_RM && onPeak) {
    yield put({
      type: INTEGRATION.RM_ONE,
      payload,
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF && onPeak) {
    yield put({
      type: INTEGRATION.SET_REF,
      payload,
    });
  } else if (uiSweepType === LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_CLICK && onPeak) {
    const { xExtent, xL, xU } = payload;
    if (xExtent) {
      yield put({
        type: MULTIPLICITY.ONE_CLICK_BY_UI,
        payload: xExtent,
      });
    } else if (xL && xU) {
      yield put({
        type: MULTIPLICITY.ONE_CLICK_BY_UI,
        payload: { xL, xU },
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
  }
}

const managerSagas = [
  takeEvery(UI.CLICK_TARGET, clickUiTarget),
  takeEvery(UI.SWEEP.SELECT, selectUiSweep),
  takeEvery(UI.WHEEL.SCROLL, scrollUiWheel),
];

export default managerSagas;
