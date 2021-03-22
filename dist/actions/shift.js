'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rmShiftPeak = exports.setShiftRef = undefined;

var _action_type = require('../constants/action_type');

var setShiftRef = function setShiftRef(payload) {
  return {
    type: _action_type.SHIFT.SET_REF,
    payload: payload
  };
};

var rmShiftPeak = function rmShiftPeak() {
  return {
    type: _action_type.SHIFT.RM_PEAK,
    payload: null
  };
};

exports.setShiftRef = setShiftRef;
exports.rmShiftPeak = rmShiftPeak; // eslint-disable-line