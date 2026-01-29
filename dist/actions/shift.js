"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setShiftRef = exports.rmShiftPeak = void 0;
var _action_type = require("../constants/action_type");
const setShiftRef = payload => ({
  type: _action_type.SHIFT.SET_REF,
  payload
});
exports.setShiftRef = setShiftRef;
const rmShiftPeak = () => ({
  type: _action_type.SHIFT.RM_PEAK,
  payload: null
});

// eslint-disable-line
exports.rmShiftPeak = rmShiftPeak;