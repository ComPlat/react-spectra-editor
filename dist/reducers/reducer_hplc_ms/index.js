"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialState = exports.default = void 0;
var _action_type = require("../../constants/action_type");
var _utils = require("./utils");
var _hydrate = require("./hydrate");
var _uvvis = require("./uvvis");
var _tic = require("./tic");
/* eslint-disable default-param-last */

const initialState = exports.initialState = {
  uvvis: {
    listWaveLength: null,
    selectedWaveLength: null,
    wavelengthIdx: 0,
    spectraList: [],
    currentSpectrum: null
  },
  ms: {
    positive: {
      peaks: [],
      pageValues: []
    },
    negative: {
      peaks: [],
      pageValues: []
    },
    neutral: {
      peaks: [],
      pageValues: []
    }
  },
  uvvisEditHistory: {
    past: [],
    future: []
  },
  tic: {
    currentPageValue: null,
    polarity: 'positive',
    available: {
      positive: false,
      negative: false,
      neutral: false
    },
    positive: {
      data: {
        x: [],
        y: []
      }
    },
    negative: {
      data: {
        x: [],
        y: []
      }
    },
    neutral: {
      data: {
        x: [],
        y: []
      }
    }
  },
  threshold: {
    isEdit: false,
    value: 5,
    originalValue: 5
  },
  lcmsIntegrationsExport: 'percent',
  lcmsDatasetKey: null,
  layout: 'LC/MS'
};
const clearState = state => ({
  ...initialState,
  lcmsIntegrationsExport: state?.lcmsIntegrationsExport ?? initialState.lcmsIntegrationsExport
});
const hplcMsReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.HPLC_MS.SET_LCMS_INTEGRATIONS_EXPORT:
      {
        const next = (0, _utils.normalizeLcmsIntegrationsExport)(action.payload?.lcmsIntegrationsExport);
        return {
          ...state,
          lcmsIntegrationsExport: next
        };
      }
    case _action_type.CURVE.SET_ALL_CURVES:
      return (0, _hydrate.updateLcmsData)(state, action);
    case _action_type.HPLC_MS.UPDATE_UVVIS_WAVE_LENGTH:
      return (0, _uvvis.updateWavelength)(state, action);
    case _action_type.HPLC_MS.SELECT_TIC_CURVE:
      return (0, _tic.updateTic)(state, action);
    case _action_type.HPLC_MS.UPDATE_CURRENT_PAGE_VALUE:
      return (0, _tic.updateCurrentPageValue)(state, action);
    case _action_type.HPLC_MS.UVVIS_UNDO:
      return (0, _uvvis.uvvisUndo)(state);
    case _action_type.HPLC_MS.UVVIS_REDO:
      return (0, _uvvis.uvvisRedo)(state);
    case _action_type.HPLC_MS.UPDATE_HPLCMS_INTEGRATIONS:
      return (0, _uvvis.updateHplcMsIntegrations)(state, action);
    case _action_type.HPLC_MS.UPDATE_HPLCMS_PEAKS:
      return (0, _uvvis.updateHplcMsPeaks)(state, action);
    case _action_type.HPLC_MS.REMOVE_HPLCMS_PEAK:
      return (0, _uvvis.removeHplcMsPeak)(state, action);
    case _action_type.HPLC_MS.CLEAR_INTEGRATION_ALL_HPLCMS:
      return (0, _uvvis.clearIntegrationAllHplcMs)(state, action);
    case _action_type.THRESHOLD.UPDATE_VALUE:
      return (0, _tic.updateThresholdValue)(state, action);
    case _action_type.THRESHOLD.RESET_VALUE:
      return (0, _tic.resetThresholdValue)(state);
    case _action_type.HPLC_MS.CLEAR_ALL_PEAKS_HPLCMS:
      return (0, _uvvis.clearAllPeaksHplcMs)(state, action);
    case _action_type.HPLC_MS.CLEAR_STATE:
      return clearState(state);
    default:
      return state;
  }
};
var _default = exports.default = hplcMsReducer;