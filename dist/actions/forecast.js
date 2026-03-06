"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setNmrStatus = exports.setIrStatus = exports.initForecastStatus = exports.clearForecastStatus = void 0;
var _action_type = require("../constants/action_type");
const initForecastStatus = payload => ({
  type: _action_type.FORECAST.INIT_STATUS,
  payload
});
exports.initForecastStatus = initForecastStatus;
const setIrStatus = payload => ({
  type: _action_type.FORECAST.SET_IR_STATUS,
  payload
});
exports.setIrStatus = setIrStatus;
const setNmrStatus = payload => ({
  type: _action_type.FORECAST.SET_NMR_STATUS,
  payload
});
exports.setNmrStatus = setNmrStatus;
const clearForecastStatus = payload => ({
  type: _action_type.FORECAST.CLEAR_STATUS,
  payload
});
exports.clearForecastStatus = clearForecastStatus;