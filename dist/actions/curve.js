'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAllCurves = exports.selectCurve = undefined;

var _action_type = require('../constants/action_type');

var selectCurve = function selectCurve(payload) {
  return {
    type: _action_type.CURVE.SELECT_WORKING_CURVE,
    payload: payload
  };
};

var setAllCurves = function setAllCurves(payload) {
  return {
    type: _action_type.CURVE.SET_ALL_CURVES,
    payload: payload
  };
};

exports.selectCurve = selectCurve;
exports.setAllCurves = setAllCurves;