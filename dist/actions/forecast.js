'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearForecastStatus = exports.setNmrStatus = exports.setIrStatus = exports.initForecastStatus = undefined;

var _action_type = require('../constants/action_type');

var initForecastStatus = function initForecastStatus(payload) {
  return {
    type: _action_type.FORECAST.INIT_STATUS,
    payload: payload
  };
};

var setIrStatus = function setIrStatus(payload) {
  return {
    type: _action_type.FORECAST.SET_IR_STATUS,
    payload: payload
  };
};

var setNmrStatus = function setNmrStatus(payload) {
  return {
    type: _action_type.FORECAST.SET_NMR_STATUS,
    payload: payload
  };
};

var clearForecastStatus = function clearForecastStatus(payload) {
  return {
    type: _action_type.FORECAST.CLEAR_STATUS,
    payload: payload
  };
};

exports.initForecastStatus = initForecastStatus;
exports.setIrStatus = setIrStatus;
exports.setNmrStatus = setNmrStatus;
exports.clearForecastStatus = clearForecastStatus;