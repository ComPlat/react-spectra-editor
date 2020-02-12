import { put, takeEvery, select } from 'redux-saga/effects';

import { UI, MULTIPLICITY, MANAGER } from '../constants/action_type';
import { calcMpyCoup } from '../helpers/calc';

const getMetaSt = state => state.meta;

const getMultiplicitySt = state => state.multiplicity;

function* selectMpy(action) {
  const metaSt = yield select(getMetaSt);
  const mpySt = yield select(getMultiplicitySt);

  const { xExtent, yExtent, dataPks } = action.payload;
  const { shift, stack } = mpySt;
  const { xL, xU } = xExtent;
  const { yL, yU } = yExtent;
  let peaks = dataPks.filter(p => xL <= p.x && p.x <= xU && yL <= p.y && p.y <= yU);
  peaks = peaks.map(pk => ({ x: pk.x + shift, y: pk.y }));
  const newXExtemt = { xL: xL + shift, xU: xU + shift };
  const coupling = calcMpyCoup(peaks, metaSt);
  const m = {
    peaks,
    xExtent: newXExtemt,
    yExtent,
    mpyType: coupling.type,
    js: coupling.js,
  };
  const newStack = [...stack, m];
  const payload = Object.assign(
    {}, mpySt, { stack: newStack, smExtext: newXExtemt },
  );

  yield put({
    type: UI.SWEEP.SELECT_MULTIPLICITY_RDC,
    payload,
  });
}

function* addUiPeakToStack(action) {
  const metaSt = yield select(getMetaSt);
  const mpySt = yield select(getMultiplicitySt);

  const { shift, stack, smExtext } = mpySt;
  let { x, y } = action.payload; // eslint-disable-line
  if (!x || !y) {
    yield put({
      type: MULTIPLICITY.PEAK_ADD_BY_UI_RDC,
      payload: mpySt,
    });
  }

  x += shift;
  const newPeak = { x, y };
  const { xL, xU } = smExtext;
  if (x < xL || xU < x) {
    yield put({
      type: MULTIPLICITY.PEAK_ADD_BY_UI_RDC,
      payload: mpySt,
    });
  }

  const newStack = stack.map((k) => {
    if (k.xExtent.xL === xL && k.xExtent.xU === xU) {
      const existXs = k.peaks.map(pk => pk.x);
      if (existXs.indexOf(newPeak.x) >= 0) return k;
      const newPks = [...k.peaks, newPeak];
      const coupling = calcMpyCoup(newPks, metaSt);
      return Object.assign(
        {},
        k,
        {
          peaks: newPks,
          mpyType: coupling.type,
          js: coupling.js,
        },
      );
    }
    return k;
  });
  const payload = Object.assign({}, mpySt, { stack: newStack });

  yield put({
    type: MULTIPLICITY.PEAK_ADD_BY_UI_RDC,
    payload,
  });
}

const rmPeakFromStack = (action, metaSt, mpySt) => {
  const { peak, xExtent } = action.payload;
  const { stack } = mpySt;
  let newStack = stack.map((k) => {
    if (k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU) {
      const newPks = k.peaks.filter(pk => pk.x !== peak.x);
      const coupling = calcMpyCoup(newPks, metaSt);
      return Object.assign(
        {},
        k,
        {
          peaks: newPks,
          mpyType: coupling.type,
          js: coupling.js,
        },
      );
    }
    return k;
  });
  newStack = newStack.filter(k => k.peaks.length !== 0);
  if (newStack.length === 0) return Object.assign({}, mpySt, { stack: newStack, smExtext: false });
  const noSmExtext = newStack.map(k => (
    (k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU) ? 1 : 0
  )).reduce((a, s) => a + s) === 0;
  const newSmExtext = noSmExtext ? newStack[0].xExtent : xExtent;
  return Object.assign({}, mpySt, { stack: newStack, smExtext: newSmExtext });
};

function* rmPanelPeakFromStack(action) {
  const metaSt = yield select(getMetaSt);
  const mpySt = yield select(getMultiplicitySt);

  const payload = rmPeakFromStack(action, metaSt, mpySt);

  yield put({
    type: MULTIPLICITY.PEAK_RM_BY_PANEL_RDC,
    payload,
  });
}

function* rmUiPeakFromStack(action) {
  const metaSt = yield select(getMetaSt);
  const mpySt = yield select(getMultiplicitySt);

  const peak = action.payload;
  const xExtent = mpySt.smExtext;
  const newAction = Object.assign({}, action, { payload: { peak, xExtent } });

  const payload = rmPeakFromStack(newAction, metaSt, mpySt);

  yield put({
    type: MULTIPLICITY.PEAK_RM_BY_UI_RDC,
    payload,
  });
}

function* resetParamsAll(action) {
  const { multiplicity } = action.payload;
  const mpySt = yield select(getMultiplicitySt);

  if (multiplicity) {
    yield put({
      type: MULTIPLICITY.RESET_ALL_RDC,
      payload: Object.assign({}, mpySt, multiplicity),
    });
  }
  // const metaSt = yield select(getMetaSt);
  // const mpySt = yield select(getMultiplicitySt);

  // if (!multiplicity) {
  //   yield put({
  //     type: MULTIPLICITY.RESET_ALL_RDC,
  //     payload: mpySt,
  //   });
  // }

  // const { stack } = multiplicity;
  // const newStack = stack.map((k) => {
  //   const { peaks } = k;
  //   const coupling = calcMpyCoup(peaks, metaSt);
  //   return Object.assign(
  //     {},
  //     k,
  //     {
  //       peaks,
  //       mpyType: coupling.type,
  //       js: coupling.js,
  //     },
  //   );
  // });
  // const payload = Object.assign({}, mpySt, { stack: newStack });
  // yield put({
  //   type: MULTIPLICITY.RESET_ALL_RDC,
  //   payload,
  // });
}

function* resetOne(action) {
  const xExtent = action.payload;

  const metaSt = yield select(getMetaSt);
  const mpySt = yield select(getMultiplicitySt);

  const { stack } = mpySt;
  const newStack = stack.map((k) => {
    if (k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU) {
      const { peaks } = k;
      const coupling = calcMpyCoup(peaks, metaSt);
      return Object.assign(
        {},
        k,
        {
          peaks,
          mpyType: coupling.type,
          js: coupling.js,
        },
      );
    }
    return k;
  });
  const payload = Object.assign({}, mpySt, { stack: newStack });
  yield put({
    type: MULTIPLICITY.RESET_ONE_RDC,
    payload,
  });
}

const multiplicitySagas = [
  takeEvery(UI.SWEEP.SELECT_MULTIPLICITY, selectMpy),
  takeEvery(MULTIPLICITY.PEAK_ADD_BY_UI, addUiPeakToStack),
  takeEvery(MULTIPLICITY.PEAK_RM_BY_PANEL, rmPanelPeakFromStack),
  takeEvery(MULTIPLICITY.PEAK_RM_BY_UI, rmUiPeakFromStack),
  takeEvery(MULTIPLICITY.RESET_ONE, resetOne),
  takeEvery(MANAGER.RESETPARAMSALL, resetParamsAll),
];

export default multiplicitySagas;
