'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _action_type = require('../constants/action_type');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {
  predictions: {
    outline: {},
    output: { result: [] }
  }
};

var updateIrResl = function updateIrResl(stResl, plPred) {
  var sma = plPred.sma,
      identity = plPred.identity,
      value = plPred.value;
  var svgs = stResl.svgs;

  var prevFgs = stResl.fgs;
  var nextVal = _defineProperty({}, 'status' + identity, value);
  var nextFgs = prevFgs.map(function (fg) {
    if (fg.sma === sma) {
      return Object.assign({}, fg, nextVal);
    }
    return fg;
  });
  var nextResult = { type: 'ir', fgs: nextFgs, svgs: svgs };
  return nextResult;
};

var updateIrStatus = function updateIrStatus(state, action) {
  var predictions = action.payload.predictions;
  var _state$predictions = state.predictions,
      outline = _state$predictions.outline,
      output = _state$predictions.output;

  var stResl = output.result[0];
  var nextResl = updateIrResl(stResl, predictions);

  return Object.assign({}, state, {
    predictions: {
      outline: outline,
      output: {
        result: [nextResl]
      }
    }
  });
};

var updateNmrResl = function updateNmrResl(stResl, plPred) {
  var idx = plPred.idx,
      atom = plPred.atom,
      identity = plPred.identity,
      value = plPred.value;

  var preResult = stResl;

  var nextShifts = preResult.shifts.map(function (s, index) {
    if (s.atom === atom && index === idx) {
      return Object.assign({}, s, _defineProperty({}, 'status' + identity, value));
    }
    return s;
  });
  var nextResult = Object.assign({}, preResult, { shifts: nextShifts });
  return nextResult;
};

var updateNmrStatus = function updateNmrStatus(state, action) {
  var predictions = action.payload.predictions;
  var _state$predictions2 = state.predictions,
      outline = _state$predictions2.outline,
      output = _state$predictions2.output;

  var stResl = output.result[0];
  var nextResl = updateNmrResl(stResl, predictions);

  var newSt = Object.assign({}, state, {
    predictions: {
      outline: outline,
      output: {
        result: [nextResl]
      }
    }
  });
  return newSt;
};

var forecastReducer = function forecastReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

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

exports.default = forecastReducer;