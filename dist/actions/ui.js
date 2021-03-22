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
  return {
    type: _action_type.UI.SWEEP.SET_TYPE,
    payload: payload
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
  return {
    type: _action_type.UI.CLICK_TARGET,
    payload: payload,
    onPeak: onPeak
  };
};

exports.setUiViewerType = setUiViewerType;
exports.setUiSweepType = setUiSweepType;
exports.selectUiSweep = selectUiSweep;
exports.scrollUiWheel = scrollUiWheel;
exports.clickUiTarget = clickUiTarget;