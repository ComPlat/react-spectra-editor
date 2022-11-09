import { put, takeEvery, select } from 'redux-saga/effects';

import { UI, MULTIPLICITY, MANAGER } from '../constants/action_type';
import { calcMpyCoup } from '../helpers/multiplicity_calc';
import { calcMpyManual } from '../helpers/multiplicity_manual';

const getMetaSt = state => state.meta;

const getMultiplicitySt = state => state.multiplicity.present;

function* selectMpy(action) {
 
  const metaSt = yield select(getMetaSt);
  const mpySt = yield select(getMultiplicitySt);

  const { newData, curveIdx } = action.payload;

  const { multiplicities } = mpySt;
  let selectedMulti = multiplicities[curveIdx];
  if (selectedMulti === false || selectedMulti === undefined) {
    selectedMulti = {
      stack: [],
      shift: 0,
      smExtext: false,
      edited: false,
    }
  }

  const { xExtent, yExtent, dataPks } = newData;
  const { shift, stack } = selectedMulti;
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

  const newSelectedMulti = Object.assign({}, selectedMulti, { stack: newStack, smExtext: newXExtemt });
  multiplicities[curveIdx] = newSelectedMulti;

  const payload = Object.assign(
    {}, mpySt, { multiplicities, selectedIdx: curveIdx },
  );

  yield put({
    type: UI.SWEEP.SELECT_MULTIPLICITY_RDC,
    payload,
  });
}

function* addUiPeakToStack(action) {
  const metaSt = yield select(getMetaSt);
  const mpySt = yield select(getMultiplicitySt);

  const { selectedIdx, multiplicities } = mpySt;
  const selectedMulti = multiplicities[selectedIdx];

  const { shift, stack, smExtext } = selectedMulti;
  let { x, y } = action.payload; // eslint-disable-line
  if (!x || !y) return;

  x += shift;
  const newPeak = { x, y };
  const { xL, xU } = smExtext;
  if (x < xL || xU < x) return;

  let isDuplicate = false;
  const newStack = stack.map((k) => {
    if (k.xExtent.xL === xL && k.xExtent.xU === xU) {
      const existXs = k.peaks.map(pk => pk.x);
      if (existXs.indexOf(newPeak.x) >= 0) {
        isDuplicate = true;
        return k;
      }
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
  if (isDuplicate) return;

  const newSelectedMulti = Object.assign({}, selectedMulti,{ stack: newStack });
  multiplicities[selectedIdx] = newSelectedMulti;

  const payload = Object.assign({}, mpySt, { multiplicities });

  yield put({
    type: MULTIPLICITY.PEAK_ADD_BY_UI_RDC,
    payload,
  });
}

const rmPeakFromStack = (action, metaSt, mpySt) => {
  const { peak, xExtent } = action.payload;

  const { selectedIdx, multiplicities } = mpySt;
  const selectedMulti = multiplicities[selectedIdx];

  const { stack } = selectedMulti;
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

  if (newStack.length === 0) {
    const newSelectedMulti = Object.assign({}, selectedMulti, { stack: newStack, smExtext: false });
    multiplicities[selectedIdx] = newSelectedMulti;
    return Object.assign({}, mpySt, { multiplicities });
  }
  const noSmExtext = newStack.map(k => (
    (k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU) ? 1 : 0
  )).reduce((a, s) => a + s) === 0;
  const newSmExtext = noSmExtext ? newStack[0].xExtent : xExtent;

  const newSelectedMulti = Object.assign({}, selectedMulti, { stack: newStack, smExtext: newSmExtext });
  multiplicities[selectedIdx] = newSelectedMulti;
  return Object.assign({}, mpySt, { multiplicities });
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

  const { selectedIdx, multiplicities } = mpySt;
  const selectedMulti = multiplicities[selectedIdx];

  const peak = action.payload;
  const xExtent = selectedMulti.smExtext;
  const newAction = Object.assign({}, action, { payload: { peak, xExtent } });

  const payload = rmPeakFromStack(newAction, metaSt, mpySt);

  yield put({
    type: MULTIPLICITY.PEAK_RM_BY_UI_RDC,
    payload,
  });
}

function* resetInitNmr(action) {
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

  const { selectedIdx, multiplicities } = mpySt;
  const selectedMulti = multiplicities[selectedIdx];

  const { stack } = selectedMulti;
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

  const newSelectedMulti = Object.assign({}, selectedMulti, { stack: newStack });
  multiplicities[selectedIdx] = newSelectedMulti;

  const payload = Object.assign({}, mpySt, { multiplicities });
  yield put({
    type: MULTIPLICITY.RESET_ONE_RDC,
    payload,
  });
}

function* selectMpyType(action) {
  const mpySt = yield select(getMultiplicitySt);
  const metaSt = yield select(getMetaSt);

  const { selectedIdx, multiplicities } = mpySt;
  const selectedMulti = multiplicities[selectedIdx];

  const { mpyType, xExtent } = action.payload;
  const { stack } = selectedMulti;
  const newStack = stack.map((k) => {
    const isTargetStack = k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU;
    if (isTargetStack) return calcMpyManual(k, mpyType, metaSt);
    return k;
  });

  const newSelectedMulti = Object.assign({}, selectedMulti, { stack: newStack });
  multiplicities[selectedIdx] = newSelectedMulti;

  const payload = Object.assign({}, mpySt, { multiplicities });

  yield put({
    type: MULTIPLICITY.TYPE_SELECT_RDC,
    payload,
  });
}

const multiplicitySagas = [
  takeEvery(UI.SWEEP.SELECT_MULTIPLICITY, selectMpy),
  takeEvery(MULTIPLICITY.PEAK_ADD_BY_UI_SAG, addUiPeakToStack),
  takeEvery(MULTIPLICITY.PEAK_RM_BY_PANEL, rmPanelPeakFromStack),
  takeEvery(MULTIPLICITY.PEAK_RM_BY_UI, rmUiPeakFromStack),
  takeEvery(MULTIPLICITY.TYPE_SELECT, selectMpyType),
  takeEvery(MULTIPLICITY.RESET_ONE, resetOne),
  takeEvery(MANAGER.RESET_INIT_NMR, resetInitNmr),
];

export default multiplicitySagas;
