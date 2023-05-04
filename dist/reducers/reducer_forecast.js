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
  }
};
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
    predictions
  } = action.payload;
  const {
    outline,
    output
  } = state.predictions;
  const stResl = output.result[0];
  const nextResl = updateIrResl(stResl, predictions);
  return Object.assign({}, state, {
    predictions: {
      outline,
      output: {
        result: [nextResl]
      }
    }
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
    predictions
  } = action.payload;
  const {
    outline,
    output
  } = state.predictions;
  const stResl = output.result[0];
  const nextResl = updateNmrResl(stResl, predictions);
  const newSt = Object.assign({}, state, {
    predictions: {
      outline,
      output: {
        result: [nextResl]
      }
    }
  });
  return newSt;
};
const forecastReducer = function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _action_type.FORECAST.INIT_STATUS:
      if (!action.payload) return state;
      return Object.assign({}, action.payload);
    case _action_type.FORECAST.SET_IR_STATUS:
      return updateIrStatus(state, action);
    case _action_type.FORECAST.SET_NMR_STATUS:
      return updateNmrStatus(state, action);
    case _action_type.FORECAST.CLEAR_STATUS:
    case _action_type.MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};
var _default = forecastReducer;
exports.default = _default;