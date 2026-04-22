/* eslint-disable default-param-last */
import { HPLC_MS, CURVE, THRESHOLD } from '../../constants/action_type';
import { normalizeLcmsIntegrationsExport } from './utils';
import { updateLcmsData } from './hydrate';
import {
  uvvisUndo,
  uvvisRedo,
  updateWavelength,
  updateHplcMsPeaks,
  updateHplcMsIntegrations,
  removeHplcMsPeak,
  clearIntegrationAllHplcMs,
  clearAllPeaksHplcMs,
} from './uvvis';
import {
  updateTic,
  updateCurrentPageValue,
  updateThresholdValue,
  resetThresholdValue,
} from './tic';

const initialState = {
  uvvis: {
    listWaveLength: null,
    selectedWaveLength: null,
    wavelengthIdx: 0,
    spectraList: [],
    currentSpectrum: null,
  },
  ms: {
    positive: { peaks: [], pageValues: [] },
    negative: { peaks: [], pageValues: [] },
    neutral: { peaks: [], pageValues: [] },
  },
  uvvisEditHistory: {
    past: [],
    future: [],
  },
  tic: {
    currentPageValue: null,
    polarity: 'positive',
    available: {
      positive: false,
      negative: false,
      neutral: false,
    },
    positive: {
      data: { x: [], y: [] },
    },
    negative: {
      data: { x: [], y: [] },
    },
    neutral: {
      data: { x: [], y: [] },
    },
  },
  threshold: {
    isEdit: false,
    value: 5,
    originalValue: 5,
  },
  lcmsIntegrationsExport: 'percent',
  lcmsDatasetKey: null,
  layout: 'LC/MS',
};

const hplcMsReducer = (state = initialState, action) => {
  switch (action.type) {
    case HPLC_MS.SET_LCMS_INTEGRATIONS_EXPORT: {
      const next = normalizeLcmsIntegrationsExport(
        action.payload?.lcmsIntegrationsExport,
      );
      return { ...state, lcmsIntegrationsExport: next };
    }
    case CURVE.SET_ALL_CURVES:
      return updateLcmsData(state, action);
    case HPLC_MS.UPDATE_UVVIS_WAVE_LENGTH:
      return updateWavelength(state, action);
    case HPLC_MS.SELECT_TIC_CURVE:
      return updateTic(state, action);
    case HPLC_MS.UPDATE_CURRENT_PAGE_VALUE:
      return updateCurrentPageValue(state, action);
    case HPLC_MS.UVVIS_UNDO:
      return uvvisUndo(state);
    case HPLC_MS.UVVIS_REDO:
      return uvvisRedo(state);
    case HPLC_MS.UPDATE_HPLCMS_INTEGRATIONS:
      return updateHplcMsIntegrations(state, action);
    case HPLC_MS.UPDATE_HPLCMS_PEAKS:
      return updateHplcMsPeaks(state, action);
    case HPLC_MS.REMOVE_HPLCMS_PEAK:
      return removeHplcMsPeak(state, action);
    case HPLC_MS.CLEAR_INTEGRATION_ALL_HPLCMS:
      return clearIntegrationAllHplcMs(state, action);
    case THRESHOLD.UPDATE_VALUE:
      return updateThresholdValue(state, action);
    case THRESHOLD.RESET_VALUE:
      return resetThresholdValue(state);
    case HPLC_MS.CLEAR_ALL_PEAKS_HPLCMS:
      return clearAllPeaksHplcMs(state, action);
    default:
      return state;
  }
};

export default hplcMsReducer;
