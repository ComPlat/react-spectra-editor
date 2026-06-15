"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lcmsHandleIntegrationAdd = lcmsHandleIntegrationAdd;
exports.lcmsHandleIntegrationRm = lcmsHandleIntegrationRm;
exports.lcmsHandlePeakDelete = lcmsHandlePeakDelete;
exports.lcmsHandleSelectZoomIn = lcmsHandleSelectZoomIn;
exports.lcmsHandleSelectZoomReset = lcmsHandleSelectZoomReset;
var _effects = require("redux-saga/effects");
var _action_type = require("../constants/action_type");
function* lcmsHandleSelectZoomIn({
  payload,
  zoom
}) {
  const {
    graphIndex
  } = zoom;
  let lcmsSyncX;
  if ((graphIndex === 0 || graphIndex === 1) && payload?.xExtent) {
    lcmsSyncX = graphIndex === 0 ? 1 : 0;
  }
  yield (0, _effects.put)({
    type: _action_type.UI.SWEEP.SELECT_ZOOMIN,
    payload: {
      graphIndex,
      zoomValue: payload,
      ...(lcmsSyncX != null ? {
        lcmsSyncX
      } : {})
    }
  });
}
function* lcmsHandleSelectZoomReset() {
  yield (0, _effects.put)({
    type: _action_type.UI.SWEEP.SELECT_ZOOMRESET,
    payload: {
      graphIndex: 0
    }
  });
  yield (0, _effects.put)({
    type: _action_type.UI.SWEEP.SELECT_ZOOMRESET,
    payload: {
      graphIndex: 1
    }
  });
}
function* lcmsHandleIntegrationAdd({
  uvvis,
  payload
}) {
  yield (0, _effects.put)({
    type: _action_type.HPLC_MS.UPDATE_HPLCMS_INTEGRATIONS,
    payload: {
      spectrumId: uvvis.selectedWaveLength,
      integration: payload
    }
  });
}
function* lcmsHandlePeakDelete({
  uvvis,
  payload
}) {
  yield (0, _effects.put)({
    type: _action_type.HPLC_MS.REMOVE_HPLCMS_PEAK,
    payload: {
      spectrumId: uvvis.selectedWaveLength,
      peak: payload
    }
  });
}
function* lcmsHandleIntegrationRm({
  uvvis,
  payload
}) {
  yield (0, _effects.put)({
    type: _action_type.HPLC_MS.UPDATE_HPLCMS_INTEGRATIONS,
    payload: {
      spectrumId: uvvis.selectedWaveLength,
      integration: payload,
      remove: true
    }
  });
}