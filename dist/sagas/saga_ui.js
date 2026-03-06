"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _effects = require("redux-saga/effects");
var _action_type = require("../constants/action_type");
var _list_ui = require("../constants/list_ui");
var _list_layout = require("../constants/list_layout");
var _list_graph = require("../constants/list_graph");
const getUiState = state => state.ui;
const getCurveState = state => state.curve;
const getHplcMsState = state => state.hplcMs;
const getSubViewZoomActionType = () => _action_type.UI.SWEEP.SELECT_ZOOMIN_SUBVIEW || _action_type.UI.SWEEP.SELECT_ZOOMIN;
const calcPeaks = payload => {
  const {
    xExtent,
    yExtent,
    dataPks
  } = payload;
  if (!dataPks) return [];
  const {
    xL,
    xU
  } = xExtent;
  const {
    yL,
    yU
  } = yExtent;
  const peaks = dataPks.filter(p => xL <= p.x && p.x <= xU && yL <= p.y && p.y <= yU);
  return peaks;
};
const getLayoutState = state => state.layout;
function* selectUiSweep(action) {
  const uiState = yield (0, _effects.select)(getUiState);
  const {
    sweepType,
    zoom
  } = uiState;
  const {
    payload
  } = action;
  const curveState = yield (0, _effects.select)(getCurveState);
  const {
    curveIdx
  } = curveState;
  const hplcMsState = yield (0, _effects.select)(getHplcMsState);
  const {
    uvvis
  } = hplcMsState;
  const layoutState = yield (0, _effects.select)(getLayoutState);
  switch (sweepType) {
    case _list_ui.LIST_UI_SWEEP_TYPE.ZOOMIN:
      if (layoutState === _list_layout.LIST_LAYOUT.LC_MS && uvvis.listWaveLength) {
        const {
          graphIndex
        } = zoom;
        yield (0, _effects.put)({
          type: _action_type.UI.SWEEP.SELECT_ZOOMIN,
          payload: {
            graphIndex,
            zoomValue: payload
          }
        });
      } else {
        yield (0, _effects.put)({
          type: _action_type.UI.SWEEP.SELECT_ZOOMIN,
          payload
        });
      }
      break;
    case _list_ui.LIST_UI_SWEEP_TYPE.ZOOMRESET:
      yield (0, _effects.put)({
        type: _action_type.UI.SWEEP.SELECT_ZOOMRESET,
        payload
      });
      break;
    case _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_ADD:
      {
        if (uvvis.selectedWaveLength && layoutState === _list_layout.LIST_LAYOUT.LC_MS) {
          yield (0, _effects.put)({
            type: _action_type.HPLC_MS.UPDATE_HPLCMS_INTEGRATIONS,
            payload: {
              spectrumId: uvvis.selectedWaveLength,
              integration: payload
            }
          });
        } else {
          yield (0, _effects.put)({
            type: _action_type.UI.SWEEP.SELECT_INTEGRATION,
            payload: {
              newData: payload,
              curveIdx
            }
          });
        }
        break;
      }
    case _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_SWEEP_ADD:
      {
        const peaks = calcPeaks(payload); // eslint-disable-line
        if (peaks.length === 0) {
          break;
        }
        const newPayload = {
          ...payload,
          peaks
        }; // eslint-disable-line

        yield (0, _effects.put)({
          type: _action_type.UI.SWEEP.SELECT_INTEGRATION,
          payload: {
            newData: newPayload,
            curveIdx
          }
        });
        yield (0, _effects.put)({
          type: _action_type.UI.SWEEP.SELECT_MULTIPLICITY,
          payload: {
            newData: newPayload,
            curveIdx
          }
        });
        break;
      }
    default:
      break;
  }
  return null;
}
function* scrollUiWheel(action) {
  const layoutState = yield (0, _effects.select)(getLayoutState);
  const {
    payload
  } = action;
  if (!payload?.xExtent || !payload?.yExtent) return;
  const {
    xExtent,
    yExtent,
    direction,
    brushClass
  } = payload;
  const {
    yL,
    yU
  } = yExtent;
  const [yeL, yeU] = [yL + (yU - yL) * 0.1, yU - (yU - yL) * 0.1];
  const scale = direction ? 0.8 : 1.25;
  let nextExtent = {
    xExtent: false,
    yExtent: false
  };
  let [nyeL, nyeU, h, nytL, nytU] = [0, 1, 1, 0, 1];
  switch (layoutState) {
    case _list_layout.LIST_LAYOUT.IR:
    case _list_layout.LIST_LAYOUT.RAMAN:
      [nyeL, nyeU] = [yeL + (yeU - yeL) * (1 - scale), yeU];
      h = nyeU - nyeL;
      [nytL, nytU] = [nyeL - 0.125 * h, nyeU + 0.125 * h];
      nextExtent = {
        xExtent,
        yExtent: {
          yL: nytL,
          yU: nytU
        }
      };
      break;
    case _list_layout.LIST_LAYOUT.MS:
      [nyeL, nyeU] = [0, yeL + (yeU - yeL) * scale];
      h = nyeU - nyeL;
      [nytL, nytU] = [nyeL - 0.125 * h, nyeU + 0.125 * h];
      nextExtent = {
        xExtent,
        yExtent: {
          yL: nytL,
          yU: nytU
        }
      };
      break;
    case _list_layout.LIST_LAYOUT.UVVIS:
    case _list_layout.LIST_LAYOUT.HPLC_UVVIS:
    case _list_layout.LIST_LAYOUT.TGA:
    case _list_layout.LIST_LAYOUT.DSC:
    case _list_layout.LIST_LAYOUT.XRD:
    default:
      [nyeL, nyeU] = [yeL, yeL + (yeU - yeL) * scale];
      h = nyeU - nyeL;
      [nytL, nytU] = [nyeL - 0.125 * h, nyeU + 0.125 * h];
      nextExtent = {
        xExtent,
        yExtent: {
          yL: nytL,
          yU: nytU
        }
      };
      break;
  }
  if (brushClass === `.${_list_graph.LIST_BRUSH_SVG_GRAPH.RECT}`) {
    yield (0, _effects.put)({
      type: getSubViewZoomActionType(),
      payload: nextExtent
    });
  } else {
    yield (0, _effects.put)({
      type: _action_type.UI.SWEEP.SELECT_ZOOMIN,
      payload: nextExtent
    });
  }
}
const getUiSweepType = state => state.ui.sweepType;
function* clickUiTarget(action) {
  const {
    payload,
    onPeak,
    voltammetryPeakIdx,
    onPecker
  } = action;
  const uiSweepType = yield (0, _effects.select)(getUiSweepType);
  const curveState = yield (0, _effects.select)(getCurveState);
  const {
    curveIdx
  } = curveState;
  const hplcMsState = yield (0, _effects.select)(getHplcMsState);
  const {
    uvvis
  } = hplcMsState;
  const isLcmsLayout = (yield (0, _effects.select)(getLayoutState)) === _list_layout.LIST_LAYOUT.LC_MS;
  if (uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.PEAK_ADD && !onPeak) {
    const spectrumId = hplcMsState?.uvvis?.selectedWaveLength;
    if (isLcmsLayout && spectrumId == null) return;
    const currentPeaks = hplcMsState?.uvvis?.currentSpectrum?.peaks || [];
    const updatedPeaks = [...currentPeaks, payload];
    yield (0, _effects.put)({
      type: _action_type.HPLC_MS.UPDATE_HPLCMS_PEAKS,
      payload: {
        spectrumId,
        peaks: updatedPeaks
      }
    });
  } else if (uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.PEAK_DELETE && onPeak) {
    if (isLcmsLayout && uvvis.selectedWaveLength) {
      yield (0, _effects.put)({
        type: _action_type.HPLC_MS.REMOVE_HPLCMS_PEAK,
        payload: {
          spectrumId: uvvis.selectedWaveLength,
          peak: payload
        }
      });
    } else {
      yield (0, _effects.put)({
        type: _action_type.EDITPEAK.ADD_NEGATIVE,
        payload: {
          dataToAdd: payload,
          curveIdx
        }
      });
    }
  } else if (uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT && onPeak) {
    yield (0, _effects.put)({
      type: _action_type.SHIFT.SET_PEAK,
      payload: {
        dataToSet: payload,
        curveIdx
      }
    });
  } else if (uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_RM && onPeak) {
    if (uvvis.selectedWaveLength && isLcmsLayout) {
      yield (0, _effects.put)({
        type: _action_type.HPLC_MS.UPDATE_HPLCMS_INTEGRATIONS,
        payload: {
          spectrumId: uvvis.selectedWaveLength,
          integration: payload,
          remove: true
        }
      });
    } else {
      yield (0, _effects.put)({
        type: _action_type.INTEGRATION.RM_ONE,
        payload: {
          dataToRemove: payload,
          curveIdx
        }
      });
    }
  } else if (uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_RM && onPeak) {
    yield (0, _effects.put)({
      type: _action_type.INTEGRATION.RM_ONE,
      payload: {
        dataToRemove: payload,
        curveIdx
      }
    });
  } else if (uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF && onPeak) {
    yield (0, _effects.put)({
      type: _action_type.INTEGRATION.SET_REF,
      payload: {
        refData: payload,
        curveIdx
      }
    });
  } else if (uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_CLICK && onPeak) {
    const {
      xExtent,
      xL,
      xU
    } = payload;
    if (xExtent) {
      yield (0, _effects.put)({
        type: _action_type.MULTIPLICITY.ONE_CLICK_BY_UI,
        payload: {
          payloadData: xExtent,
          curveIdx
        }
      });
    } else if (xL && xU) {
      yield (0, _effects.put)({
        type: _action_type.MULTIPLICITY.ONE_CLICK_BY_UI,
        payload: {
          payloadData: {
            xL,
            xU
          },
          curveIdx
        }
      });
    }
  } else if (uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_ADD) {
    yield (0, _effects.put)({
      type: _action_type.MULTIPLICITY.PEAK_ADD_BY_UI_SAG,
      payload
    });
  } else if (uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_RM && onPeak) {
    yield (0, _effects.put)({
      type: _action_type.MULTIPLICITY.PEAK_RM_BY_UI,
      payload
    });
  } else if (uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MAX_PEAK && !onPeak) {
    yield (0, _effects.put)({
      type: _action_type.CYCLIC_VOLTA_METRY.ADD_MAX_PEAK,
      payload: {
        peak: payload,
        index: voltammetryPeakIdx,
        jcampIdx: curveIdx
      }
    });
  } else if (uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MAX_PEAK && onPeak) {
    yield (0, _effects.put)({
      type: _action_type.CYCLIC_VOLTA_METRY.REMOVE_MAX_PEAK,
      payload: {
        index: voltammetryPeakIdx,
        jcampIdx: curveIdx
      }
    });
  } else if (uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_MIN_PEAK && !onPeak) {
    yield (0, _effects.put)({
      type: _action_type.CYCLIC_VOLTA_METRY.ADD_MIN_PEAK,
      payload: {
        peak: payload,
        index: voltammetryPeakIdx,
        jcampIdx: curveIdx
      }
    });
  } else if (uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_MIN_PEAK && onPeak) {
    yield (0, _effects.put)({
      type: _action_type.CYCLIC_VOLTA_METRY.REMOVE_MIN_PEAK,
      payload: {
        index: voltammetryPeakIdx,
        jcampIdx: curveIdx
      }
    });
  } else if (uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_ADD_PECKER && !onPecker) {
    yield (0, _effects.put)({
      type: _action_type.CYCLIC_VOLTA_METRY.ADD_PECKER,
      payload: {
        peak: payload,
        index: voltammetryPeakIdx,
        jcampIdx: curveIdx
      }
    });
  } else if (uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_RM_PECKER && onPecker) {
    yield (0, _effects.put)({
      type: _action_type.CYCLIC_VOLTA_METRY.REMOVE_PECKER,
      payload: {
        index: voltammetryPeakIdx,
        jcampIdx: curveIdx
      }
    });
  } else if (uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.CYCLIC_VOLTA_SET_REF && onPeak) {
    yield (0, _effects.put)({
      type: _action_type.CYCLIC_VOLTA_METRY.SET_REF,
      payload: {
        index: voltammetryPeakIdx,
        jcampIdx: curveIdx
      }
    });
  } else if (uiSweepType === _list_ui.LIST_UI_SWEEP_TYPE.PEAK_GROUP_SELECT) {
    yield (0, _effects.put)({
      type: _action_type.UI.SUB_VIEWER.DISPLAY_VIEWER_AT,
      payload
    });
  }
}
const managerSagas = [(0, _effects.takeEvery)(_action_type.UI.CLICK_TARGET, clickUiTarget), (0, _effects.takeEvery)(_action_type.UI.SWEEP.SELECT, selectUiSweep), (0, _effects.takeEvery)(_action_type.UI.WHEEL.SCROLL, scrollUiWheel)];
var _default = exports.default = managerSagas;