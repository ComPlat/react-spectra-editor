"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setUiViewerType = exports.setUiSweepType = exports.selectUiSweep = exports.scrollUiWheel = exports.restoreSweepExtent = exports.clickUiTarget = void 0;
var _action_type = require("../constants/action_type");
const setUiViewerType = payload => ({
  type: _action_type.UI.VIEWER.SET_TYPE,
  payload
});
exports.setUiViewerType = setUiViewerType;
const setUiSweepType = (payload, jcampIdx = 0) => ({
  type: _action_type.UI.SWEEP.SET_TYPE,
  payload,
  jcampIdx
});
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
const restoreSweepExtent = payload => ({
  type: _action_type.UI.SWEEP.SELECT_ZOOMIN,
  payload
});
exports.restoreSweepExtent = restoreSweepExtent;
const clickUiTarget = (payload, onPeak, voltammetryPeakIdx, jcampIdx, onPecker) => {
  const action = {
    type: _action_type.UI.CLICK_TARGET,
    payload,
    onPeak,
    voltammetryPeakIdx: voltammetryPeakIdx ?? 0,
    onPecker: onPecker ?? false
  };
  if (Number.isFinite(jcampIdx)) {
    action.jcampIdx = jcampIdx;
  }
  return action;
};
exports.clickUiTarget = clickUiTarget;