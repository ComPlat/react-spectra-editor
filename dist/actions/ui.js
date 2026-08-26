"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setUiViewerType = exports.setUiSweepType = exports.selectUiSweep = exports.seedLcmsUnionExtent = exports.scrollUiWheel = exports.displaySubViewerAt = exports.clickUiTarget = void 0;
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

// Seeds the LC-MS UVVIS (graph 0) and TIC (graph 1) panes with the same
// x-domain via the existing lcmsSyncX mirroring in updateZoom
// (reducer_ui.js), so both panes share one source of truth for their
// x-extent instead of each auto-fitting to its own data independently.
//
// keepGraphIndex, because this is not a user zoom: a real SELECT_ZOOMIN moves
// zoom.graphIndex to the pane the user just brushed, and saga_lcms_ui reads
// that back to decide which pane the NEXT brush belongs to. Seeding is a
// background write to slot 0, so letting it move the pointer would re-attribute
// a pending TIC zoom (sweepTypes[1] === ZOOMIN) to the UVVIS pane.
exports.displaySubViewerAt = displaySubViewerAt;
const seedLcmsUnionExtent = xExtent => ({
  type: _action_type.UI.SWEEP.SELECT_ZOOMIN,
  payload: {
    graphIndex: 0,
    zoomValue: {
      xExtent,
      yExtent: false
    },
    lcmsSyncX: 1,
    keepGraphIndex: true
  }
});
exports.seedLcmsUnionExtent = seedLcmsUnionExtent;