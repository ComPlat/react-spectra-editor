"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setUiViewerType = exports.setUiSweepType = exports.selectUiSweep = exports.scrollUiWheel = exports.clickUiTarget = void 0;
var _action_type = require("../constants/action_type");
const setUiViewerType = payload => ({
  type: _action_type.UI.VIEWER.SET_TYPE,
  payload
});
exports.setUiViewerType = setUiViewerType;
const setUiSweepType = function (payload) {
  let jcampIdx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return {
    type: _action_type.UI.SWEEP.SET_TYPE,
    payload,
    jcampIdx
  };
};
exports.setUiSweepType = setUiSweepType;
const selectUiSweep = payload => ({
  type: _action_type.UI.SWEEP.SELECT,
  payload
});
exports.selectUiSweep = selectUiSweep;
const scrollUiWheel = payload => ({
  type: _action_type.UI.WHEEL.SCROLL,
  payload
});
exports.scrollUiWheel = scrollUiWheel;
const clickUiTarget = function (payload, onPeak) {
  let voltammetryPeakIdx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let jcampIdx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  let onPecker = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  return {
    type: _action_type.UI.CLICK_TARGET,
    payload,
    onPeak,
    voltammetryPeakIdx,
    jcampIdx,
    onPecker
  };
};
exports.clickUiTarget = clickUiTarget;