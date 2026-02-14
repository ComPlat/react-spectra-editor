"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = {
  predictions: {
    outline: {},
    output: {
      result: []
    }
  },
  predictionsByCurve: {}
};
const toCurveIdx = input => Number.isInteger(input) ? input : 0;
const getPredictionsByCurve = state => state.predictionsByCurve || {};
const getPredictionsForCurve = (state, curveIdx) => getPredictionsByCurve(state)[curveIdx] || state.predictions;
const updateIrResl = (stResl, plPred) => {
  const {
    sma,
    identity,
    value
  } = plPred;
  const {
    svgs
  } = stResl;
  const prevFgs = stResl.fgs;
  const nextVal = {
    [`status${identity}`]: value
  };
  const nextFgs = prevFgs.map(fg => {
    if (fg.sma === sma) {
      return Object.assign({}, fg, nextVal);
    }
    return fg;
  });
  const nextResult = {
    type: 'ir',
    fgs: nextFgs,
    svgs
  };
  return nextResult;
};
const updateIrStatus = (state, action) => {
  const {
    predictions,
    curveIdx
  } = action.payload;
  const targetIdx = toCurveIdx(curveIdx);
  const targetPredictions = getPredictionsForCurve(state, targetIdx);
  const {
    outline,
    output
  } = targetPredictions;
  const stResl = output.result[0];
  const nextResl = updateIrResl(stResl, predictions);
  const nextPredictions = {
    outline,
    output: {
      result: [nextResl]
    }
  };
  const predictionsByCurve = Object.assign({}, getPredictionsByCurve(state), {
    [targetIdx]: nextPredictions
  });
  return Object.assign({}, state, {
    predictions: nextPredictions,
    predictionsByCurve
  });
};
const updateNmrResl = (stResl, plPred) => {
  const {
    idx,
    atom,
    identity,
    value
  } = plPred;
  const preResult = stResl;
  const nextShifts = preResult.shifts.map((s, index) => {
    if (s.atom === atom && index === idx) {
      return Object.assign({}, s, {
        [`status${identity}`]: value
      });
    }
    return s;
  });
  const nextResult = Object.assign({}, preResult, {
    shifts: nextShifts
  });
  return nextResult;
};
const updateNmrStatus = (state, action) => {
  const {
    predictions,
    curveIdx
  } = action.payload;
  const targetIdx = toCurveIdx(curveIdx);
  const targetPredictions = getPredictionsForCurve(state, targetIdx);
  const {
    outline,
    output
  } = targetPredictions;
  const stResl = output.result[0];
  const nextResl = updateNmrResl(stResl, predictions);
  const nextPredictions = {
    outline,
    output: {
      result: [nextResl]
    }
  };
  const predictionsByCurve = Object.assign({}, getPredictionsByCurve(state), {
    [targetIdx]: nextPredictions
  });
  return Object.assign({}, state, {
    predictions: nextPredictions,
    predictionsByCurve
  });
};
const forecastReducer = function forecastReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _action_type.FORECAST.INIT_STATUS:
      if (!action.payload) return state;
      {
        const {
          curveIdx,
          ...payloadRest
        } = action.payload;
        const nextPredictions = payloadRest.predictions || state.predictions;
        const nextState = Object.assign({}, state, payloadRest);
        if (!Number.isInteger(curveIdx)) {
          return nextState;
        }
        const predictionsByCurve = Object.assign({}, getPredictionsByCurve(state), nextPredictions ? {
          [curveIdx]: nextPredictions
        } : {});
        return Object.assign({}, nextState, {
          predictionsByCurve
        });
      }
    case _action_type.FORECAST.SET_IR_STATUS:
      return updateIrStatus(state, action);
    case _action_type.FORECAST.SET_NMR_STATUS:
      return updateNmrStatus(state, action);
    case _action_type.FORECAST.CLEAR_STATUS:
      return initialState;
    case _action_type.MANAGER.RESETALL:
      if (action.payload && action.payload.resetForecast) {
        return initialState;
      }
      return state;
    default:
      return state;
  }
};
var _default = exports.default = forecastReducer;