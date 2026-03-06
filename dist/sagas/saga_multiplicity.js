"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _effects = require("redux-saga/effects");
var _action_type = require("../constants/action_type");
var _multiplicity_calc = require("../helpers/multiplicity_calc");
var _multiplicity_manual = require("../helpers/multiplicity_manual");
const getMetaSt = state => state.meta;
const getCurveSt = state => state.curve;
const getMultiplicitySt = state => state.multiplicity.present;
function* selectMpy(action) {
  const metaSt = yield (0, _effects.select)(getMetaSt);
  const mpySt = yield (0, _effects.select)(getMultiplicitySt);
  const {
    newData,
    curveIdx
  } = action.payload;
  const {
    multiplicities
  } = mpySt;
  let selectedMulti = multiplicities[curveIdx];
  if (selectedMulti === false || selectedMulti === undefined) {
    selectedMulti = {
      stack: [],
      shift: 0,
      smExtext: false,
      edited: false
    };
  }
  const {
    xExtent,
    yExtent,
    dataPks
  } = newData;
  const {
    shift,
    stack
  } = selectedMulti;
  const {
    xL,
    xU
  } = xExtent;
  const {
    yL,
    yU
  } = yExtent;
  let peaks = dataPks.filter(p => xL <= p.x && p.x <= xU && yL <= p.y && p.y <= yU);
  peaks = peaks.map(pk => ({
    x: pk.x + shift,
    y: pk.y
  }));
  const newXExtemt = {
    xL: xL + shift,
    xU: xU + shift
  };
  const coupling = (0, _multiplicity_calc.calcMpyCoup)(peaks, metaSt);
  const m = {
    peaks,
    xExtent: newXExtemt,
    yExtent,
    mpyType: coupling.type,
    js: coupling.js
  };
  const newStack = [...stack, m];
  const newSelectedMulti = Object.assign(
  // eslint-disable-line
  {}, selectedMulti, {
    stack: newStack,
    smExtext: newXExtemt
  });
  const newMultiplicities = [...multiplicities];
  newMultiplicities[curveIdx] = newSelectedMulti;
  const payload = Object.assign(
  // eslint-disable-line
  {}, mpySt, {
    multiplicities: newMultiplicities,
    selectedIdx: curveIdx
  });
  yield (0, _effects.put)({
    type: _action_type.UI.SWEEP.SELECT_MULTIPLICITY_RDC,
    payload
  });
}
function* addUiPeakToStack(action) {
  const metaSt = yield (0, _effects.select)(getMetaSt);
  const mpySt = yield (0, _effects.select)(getMultiplicitySt);
  const curveSt = yield (0, _effects.select)(getCurveSt);
  const {
    curveIdx
  } = curveSt;
  const {
    multiplicities
  } = mpySt;
  const selectedMulti = multiplicities[curveIdx];
  const {
    shift,
    stack,
    smExtext
  } = selectedMulti;
  let {
    x,
    y
  } = action.payload; // eslint-disable-line
  if (!x || !y) return;
  x += shift;
  const newPeak = {
    x,
    y
  };
  const {
    xL,
    xU
  } = smExtext;
  if (x < xL || xU < x) return;
  let isDuplicate = false;
  const newStack = stack.map(k => {
    if (k.xExtent.xL === xL && k.xExtent.xU === xU) {
      const existXs = k.peaks.map(pk => pk.x);
      if (existXs.indexOf(newPeak.x) >= 0) {
        isDuplicate = true;
        return k;
      }
      const newPks = [...k.peaks, newPeak];
      const coupling = (0, _multiplicity_calc.calcMpyCoup)(newPks, metaSt);
      return Object.assign(
      // eslint-disable-line
      {}, k, {
        peaks: newPks,
        mpyType: coupling.type,
        js: coupling.js
      });
    }
    return k;
  });
  if (isDuplicate) return;
  const newSelectedMulti = Object.assign({}, selectedMulti, {
    stack: newStack
  }); // eslint-disable-line
  const newMultiplicities = [...multiplicities];
  newMultiplicities[curveIdx] = newSelectedMulti;
  const payload = Object.assign({}, mpySt, {
    multiplicities: newMultiplicities
  }); // eslint-disable-line

  yield (0, _effects.put)({
    type: _action_type.MULTIPLICITY.PEAK_ADD_BY_UI_RDC,
    payload
  });
}
const rmPeakFromStack = (action, metaSt, mpySt, curveIdx = 0) => {
  const {
    peak,
    xExtent
  } = action.payload;
  const {
    multiplicities
  } = mpySt;
  const selectedMulti = multiplicities[curveIdx];
  const {
    stack
  } = selectedMulti;
  let newStack = stack.map(k => {
    if (k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU) {
      const newPks = k.peaks.filter(pk => pk.x !== peak.x);
      const coupling = (0, _multiplicity_calc.calcMpyCoup)(newPks, metaSt);
      return Object.assign(
      // eslint-disable-line
      {}, k, {
        peaks: newPks,
        mpyType: coupling.type,
        js: coupling.js
      });
    }
    return k;
  });
  newStack = newStack.filter(k => k.peaks.length !== 0);
  if (newStack.length === 0) {
    const newSelectedMulti = Object.assign({}, selectedMulti, {
      stack: newStack,
      smExtext: false
    }); // eslint-disable-line
    multiplicities[curveIdx] = newSelectedMulti;
    return Object.assign({}, mpySt, {
      multiplicities
    }); // eslint-disable-line
  }
  const noSmExtext = newStack.map(k => k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU ? 1 : 0).reduce((a, s) => a + s) === 0;
  const newSmExtext = noSmExtext ? newStack[0].xExtent : xExtent;
  const newSelectedMulti = Object.assign({}, selectedMulti, {
    stack: newStack,
    smExtext: newSmExtext
  }); // eslint-disable-line
  const newMultiplicities = [...multiplicities];
  newMultiplicities[curveIdx] = newSelectedMulti;
  return Object.assign({}, mpySt, {
    multiplicities: newMultiplicities
  }); // eslint-disable-line
};
function* rmPanelPeakFromStack(action) {
  const metaSt = yield (0, _effects.select)(getMetaSt);
  const mpySt = yield (0, _effects.select)(getMultiplicitySt);
  const curveSt = yield (0, _effects.select)(getCurveSt);
  const {
    curveIdx
  } = curveSt;
  const payload = rmPeakFromStack(action, metaSt, mpySt, curveIdx);
  yield (0, _effects.put)({
    type: _action_type.MULTIPLICITY.PEAK_RM_BY_PANEL_RDC,
    payload
  });
}
function* rmUiPeakFromStack(action) {
  const metaSt = yield (0, _effects.select)(getMetaSt);
  const mpySt = yield (0, _effects.select)(getMultiplicitySt);
  const curveSt = yield (0, _effects.select)(getCurveSt);
  const {
    curveIdx
  } = curveSt;
  const {
    multiplicities
  } = mpySt;
  const selectedMulti = multiplicities[curveIdx];
  const peak = action.payload;
  const xExtent = selectedMulti.smExtext;
  const newAction = Object.assign({}, action, {
    payload: {
      peak,
      xExtent
    }
  }); // eslint-disable-line

  const payload = rmPeakFromStack(newAction, metaSt, mpySt, curveIdx);
  yield (0, _effects.put)({
    type: _action_type.MULTIPLICITY.PEAK_RM_BY_UI_RDC,
    payload
  });
}
function* resetInitNmr(action) {
  const {
    multiplicity
  } = action.payload;
  const curveSt = yield (0, _effects.select)(getCurveSt);
  const mpySt = yield (0, _effects.select)(getMultiplicitySt);
  const {
    curveIdx
  } = curveSt;
  const {
    multiplicities
  } = mpySt;
  const newMultiplicities = [...multiplicities];
  newMultiplicities[curveIdx] = multiplicity;
  const payload = Object.assign({}, mpySt, {
    multiplicities: newMultiplicities,
    selectedIdx: curveIdx
  }); // eslint-disable-line

  if (multiplicity) {
    yield (0, _effects.put)({
      type: _action_type.MULTIPLICITY.RESET_ALL_RDC,
      payload
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
  const metaSt = yield (0, _effects.select)(getMetaSt);
  const mpySt = yield (0, _effects.select)(getMultiplicitySt);
  const curveSt = yield (0, _effects.select)(getCurveSt);
  const {
    curveIdx
  } = curveSt;
  const {
    multiplicities
  } = mpySt;
  const selectedMulti = multiplicities[curveIdx];
  const {
    stack
  } = selectedMulti;
  const newStack = stack.map(k => {
    if (k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU) {
      const {
        peaks
      } = k;
      const coupling = (0, _multiplicity_calc.calcMpyCoup)(peaks, metaSt);
      return Object.assign(
      // eslint-disable-line
      {}, k, {
        peaks,
        mpyType: coupling.type,
        js: coupling.js
      });
    }
    return k;
  });
  const newSelectedMulti = Object.assign({}, selectedMulti, {
    stack: newStack
  }); // eslint-disable-line
  const newMultiplicities = [...multiplicities];
  newMultiplicities[curveIdx] = newSelectedMulti;
  const payload = Object.assign({}, mpySt, {
    multiplicities: newMultiplicities
  }); // eslint-disable-line
  yield (0, _effects.put)({
    type: _action_type.MULTIPLICITY.RESET_ONE_RDC,
    payload
  });
}
function* selectMpyType(action) {
  const mpySt = yield (0, _effects.select)(getMultiplicitySt);
  const metaSt = yield (0, _effects.select)(getMetaSt);
  const curveSt = yield (0, _effects.select)(getCurveSt);
  const {
    curveIdx
  } = curveSt;
  const {
    multiplicities
  } = mpySt;
  const selectedMulti = multiplicities[curveIdx];
  const {
    mpyType,
    xExtent
  } = action.payload;
  const {
    stack
  } = selectedMulti;
  const newStack = stack.map(k => {
    const isTargetStack = k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU;
    if (isTargetStack) return (0, _multiplicity_manual.calcMpyManual)(k, mpyType, metaSt);
    return k;
  });
  const newSelectedMulti = Object.assign({}, selectedMulti, {
    stack: newStack
  }); // eslint-disable-line
  const newMultiplicities = [...multiplicities];
  newMultiplicities[curveIdx] = newSelectedMulti;
  const payload = Object.assign({}, mpySt, {
    multiplicities: newMultiplicities
  }); // eslint-disable-line

  yield (0, _effects.put)({
    type: _action_type.MULTIPLICITY.TYPE_SELECT_RDC,
    payload
  });
}
const multiplicitySagas = [(0, _effects.takeEvery)(_action_type.UI.SWEEP.SELECT_MULTIPLICITY, selectMpy), (0, _effects.takeEvery)(_action_type.MULTIPLICITY.PEAK_ADD_BY_UI_SAG, addUiPeakToStack), (0, _effects.takeEvery)(_action_type.MULTIPLICITY.PEAK_RM_BY_PANEL, rmPanelPeakFromStack), (0, _effects.takeEvery)(_action_type.MULTIPLICITY.PEAK_RM_BY_UI, rmUiPeakFromStack), (0, _effects.takeEvery)(_action_type.MULTIPLICITY.TYPE_SELECT, selectMpyType), (0, _effects.takeEvery)(_action_type.MULTIPLICITY.RESET_ONE, resetOne), (0, _effects.takeEvery)(_action_type.MANAGER.RESET_INIT_NMR, resetInitNmr)];
var _default = exports.default = multiplicitySagas;