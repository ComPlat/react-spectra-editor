"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleShowAllCurves = exports.setAllCurves = exports.selectCurve = void 0;
var _action_type = require("../constants/action_type");
const selectCurve = payload => ({
  type: _action_type.CURVE.SELECT_WORKING_CURVE,
  payload
});
exports.selectCurve = selectCurve;
const setAllCurves = payload => ({
  type: _action_type.CURVE.SET_ALL_CURVES,
  payload
});
exports.setAllCurves = setAllCurves;
const toggleShowAllCurves = payload => ({
  type: _action_type.CURVE.SET_SHOULD_SHOW_ALL_CURVES,
  payload
});
exports.toggleShowAllCurves = toggleShowAllCurves;