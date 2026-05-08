"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setUiViewerType = exports.setUiSweepType = exports.selectUiSweep = exports.scrollUiWheel = exports.displaySubViewerAt = exports.clickUiTarget = void 0;
var _action_type = require("../constants/action_type");
var _list_ui = require("../constants/list_ui");
var _integration_draft = require("../helpers/integration_draft.js");
// eslint-disable-line import/extensions

const keepIntegrationMode = (jcampIdx = 0) => ({
  type: _action_type.UI.SWEEP.SET_TYPE,
  payload: _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
  jcampIdx
});
const setUiViewerType = payload => {
  if (!(0, _integration_draft.confirmCancelPendingIntegration)()) {
    return keepIntegrationMode();
  }
  return {
    type: _action_type.UI.VIEWER.SET_TYPE,
    payload
  };
};
exports.setUiViewerType = setUiViewerType;
const setUiSweepType = (payload, jcampIdx = 0) => {
  if (payload !== _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD && !(0, _integration_draft.confirmCancelPendingIntegration)()) {
    return keepIntegrationMode(jcampIdx);
  }
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
const clickUiTarget = (payload, onPeak, voltammetryPeakIdx = 0, jcampIdx = 0, onPecker = false, sourceHint = null) => ({
  type: _action_type.UI.CLICK_TARGET,
  payload,
  onPeak,
  voltammetryPeakIdx,
  jcampIdx,
  onPecker,
  sourceHint
});
exports.clickUiTarget = clickUiTarget;
const displaySubViewerAt = payload => ({
  type: _action_type.UI.SUB_VIEWER.DISPLAY_VIEWER_AT,
  payload: payload == null ? {
    x: null,
    y: null
  } : payload
});
exports.displaySubViewerAt = displaySubViewerAt;