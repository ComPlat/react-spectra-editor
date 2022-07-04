'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clickUiTarget = exports.scrollUiWheel = exports.selectUiSweep = exports.setUiSweepType = exports.setUiViewerType = undefined;

var _action_type = require('../constants/action_type');

var setUiViewerType = function setUiViewerType(payload) {
  return {
    type: _action_type.UI.VIEWER.SET_TYPE,
    payload: payload
  };
};

var setUiSweepType = function setUiSweepType(payload) {
  var jcampIdx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return {
    type: _action_type.UI.SWEEP.SET_TYPE,
    payload: payload,
    jcampIdx: jcampIdx
  };
};

var selectUiSweep = function selectUiSweep(payload) {
  return {
    type: _action_type.UI.SWEEP.SELECT,
    payload: payload
  };
};

var scrollUiWheel = function scrollUiWheel(payload) {
  return {
    type: _action_type.UI.WHEEL.SCROLL,
    payload: payload
  };
};

var clickUiTarget = function clickUiTarget(payload, onPeak) {
  var voltammetryPeakIdx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var jcampIdx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var onPecker = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  return {
    type: _action_type.UI.CLICK_TARGET,
    payload: payload,
    onPeak: onPeak,
    voltammetryPeakIdx: voltammetryPeakIdx,
    jcampIdx: jcampIdx,
    onPecker: onPecker
  };
};

exports.setUiViewerType = setUiViewerType;
exports.setUiSweepType = setUiSweepType;
exports.selectUiSweep = selectUiSweep;
exports.scrollUiWheel = scrollUiWheel;
exports.clickUiTarget = clickUiTarget;