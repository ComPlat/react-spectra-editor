"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
var _format = _interopRequireDefault(require("../helpers/format"));
var _integration = require("../helpers/integration");
var _extractEntityLCMS = require("../helpers/extractEntityLCMS");
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = {
  uvvis: {
    listWaveLength: null,
    selectedWaveLength: null,
    wavelengthIdx: 0,
    spectraList: [],
    currentSpectrum: null
  },
  ms: {
    positive: {
      peaks: []
    },
    negative: {
      peaks: []
    }
  },
  tic: {
    currentPageValue: null,
    isNegative: false,
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
    }
  },
  threshold: {
    isEdit: false,
    value: 5,
    originalValue: 5
  },
  layout: 'LC/MS'
};
const updateHPLCData = (state, action) => {
  const {
    payload
  } = action;
  if (!payload || payload.length === 0) return state;
  let ticPosData = {
    x: [],
    y: []
  };
  let ticNegData = {
    x: [],
    y: []
  };
  let uvvisCurve = null;
  const mzPosFeatures = [];
  const mzNegFeatures = [];
  payload.forEach(curve => {
    const cat = (0, _extractEntityLCMS.catToString)(curve?.features?.[0]?.csCategory);
    if (cat.includes('TIC')) {
      if (cat.includes('NEGATIVE')) ticNegData = curve.features[0].data[0];else ticPosData = curve.features[0].data[0];
    } else if (cat.includes('UVVIS')) {
      uvvisCurve = curve;
    } else if (cat.includes('MZ')) {
      if (cat.includes('NEGATIVE')) mzNegFeatures.push(...curve.features);else mzPosFeatures.push(...curve.features);
    }
  });
  if (!uvvisCurve || !uvvisCurve.features) {
    return state;
  }
  const features = uvvisCurve.features;
  const getPageValue = fe => {
    let raw = fe.pageSymbol || fe.page || fe.pageValue;
    if (typeof raw === 'string') {
      raw = raw.split('\n')[0].trim();
      raw = raw.replace(/[^0-9.+-]/g, '');
    }
    return parseFloat(raw);
  };
  const filteredFeatures = features.filter(fe => fe.data && fe.data[0] && fe.data[0].x && fe.data[0].x.length > 0 && fe.data[0].y && fe.data[0].y.length > 0);
  const listWaveLength = filteredFeatures.map(fe => getPageValue(fe));
  const spectraList = filteredFeatures.map(fe => ({
    data: fe.data[0],
    integrations: fe.integrations || [],
    peaks: fe.peaks || [],
    pageValue: getPageValue(fe)
  }));
  const newUvvis = {
    ...state.uvvis,
    listWaveLength,
    selectedWaveLength: listWaveLength[0],
    wavelengthIdx: 0,
    spectraList,
    currentSpectrum: spectraList[0]
  };
  const toPeaks = fts => fts.map(f => f.data[0].y.map((y, i) => ({
    x: f.data[0].x[i],
    y: y || 0
  })));
  return {
    ...state,
    uvvis: newUvvis,
    ms: {
      positive: {
        peaks: toPeaks(mzPosFeatures)
      },
      negative: {
        peaks: toPeaks(mzNegFeatures)
      }
    },
    tic: {
      ...state.tic,
      positive: {
        data: ticPosData
      },
      negative: {
        data: ticNegData
      }
    }
  };
};
const updateHplcMsPeaks = (state, action) => {
  const {
    spectrumId,
    peaks
  } = action.payload;
  const {
    uvvis
  } = state;
  const {
    spectraList,
    listWaveLength
  } = uvvis;
  const spectrumIndex = listWaveLength.indexOf(spectrumId);
  if (spectrumIndex === -1) return state;
  const newSpectraList = [...spectraList];
  const updatedSpectrum = {
    ...newSpectraList[spectrumIndex],
    peaks
  };
  newSpectraList[spectrumIndex] = updatedSpectrum;
  const newCurrentSpectrum = spectrumId === uvvis.selectedWaveLength ? updatedSpectrum : uvvis.currentSpectrum;
  return {
    ...state,
    uvvis: {
      ...uvvis,
      spectraList: newSpectraList,
      currentSpectrum: newCurrentSpectrum
    }
  };
};
const updateWaveLength = (state, action) => {
  const {
    payload
  } = action;
  if (payload) {
    const {
      value
    } = payload.target;
    const {
      uvvis
    } = state;
    const {
      listWaveLength,
      spectraList
    } = uvvis;
    const wavelengthIdx = listWaveLength.indexOf(value);
    const currentSpectrum = spectraList.find((spectrum, index) => listWaveLength[index] === value);
    return {
      ...state,
      uvvis: {
        ...uvvis,
        selectedWaveLength: value,
        wavelengthIdx,
        spectraList,
        currentSpectrum
      }
    };
  }
  return state;
};
const updateTic = (state, action) => {
  const {
    isNegative
  } = action.payload;
  return {
    ...state,
    tic: {
      ...state.tic,
      isNegative
    }
  };
};
const updateCurrentPageValue = (state, action) => {
  const {
    currentPageValue
  } = action.payload;
  return {
    ...state,
    tic: {
      ...state.tic,
      currentPageValue
    }
  };
};
const updateThresholdValue = (state, action) => {
  const {
    payload
  } = action;
  if (payload) {
    const {
      value
    } = payload;
    return {
      ...state,
      threshold: {
        isEdit: true,
        value,
        originalValue: state.threshold.originalValue ?? value
      }
    };
  }
  return state;
};
const resetThresholdValue = state => ({
  ...state,
  threshold: {
    isEdit: true,
    value: state.threshold.originalValue,
    originalValue: state.threshold.originalValue
  }
});
const updateHplcMsIntegrations = (state, action) => {
  const {
    spectrumId,
    integration,
    remove,
    shift = 0
  } = action.payload;
  const {
    uvvis
  } = state;
  const {
    spectraList,
    listWaveLength
  } = uvvis;
  const curveIdx = listWaveLength.indexOf(spectrumId);
  if (curveIdx === -1) {
    return state;
  }
  const selectedSpectrum = spectraList[curveIdx];
  if (!selectedSpectrum) {
    return state;
  }
  const {
    integrations = []
  } = selectedSpectrum;
  const {
    xExtent,
    data
  } = integration;
  if (!xExtent || !data || !xExtent.xL || !xExtent.xU || xExtent.xU === xExtent.xL) {
    return state;
  }
  const {
    xL,
    xU
  } = xExtent;
  const area = (0, _integration.getArea)(xL, xU, data);
  const absoluteArea = (0, _integration.getAbsoluteArea)(xL, xU, data);
  const isFirst = integrations.length === 0;
  const newIntegration = {
    xL: xL + shift,
    xU: xU + shift,
    area,
    absoluteArea,
    refArea: isFirst ? area : integrations[0]?.refArea ?? area,
    xExtent,
    data
  };
  const newIntegrations = remove ? integrations.filter(int => !(int.xL === newIntegration.xL && int.xU === newIntegration.xU)) : [...integrations, newIntegration];
  const newSpectrum = {
    ...selectedSpectrum,
    integrations: newIntegrations
  };
  const newSpectraList = [...spectraList];
  newSpectraList[curveIdx] = newSpectrum;
  return {
    ...state,
    uvvis: {
      ...uvvis,
      spectraList: newSpectraList,
      currentSpectrum: spectrumId === uvvis.selectedWaveLength ? newSpectrum : uvvis.currentSpectrum
    }
  };
};
const removeHplcMsPeak = (state, action) => {
  const {
    spectrumId,
    peak
  } = action.payload;
  const {
    uvvis
  } = state;
  const {
    spectraList,
    listWaveLength
  } = uvvis;
  const index = listWaveLength.indexOf(spectrumId);
  if (index === -1) return state;
  const spectrum = spectraList[index];
  const filteredPeaks = spectrum.peaks.filter(p => !(Math.abs(p.x - peak.x) < 1e-6 && Math.abs(p.y - peak.y) < 1e-6));
  const updatedSpectrum = {
    ...spectrum,
    peaks: filteredPeaks
  };
  const updatedSpectraList = [...spectraList];
  updatedSpectraList[index] = updatedSpectrum;
  return {
    ...state,
    uvvis: {
      ...uvvis,
      spectraList: updatedSpectraList,
      currentSpectrum: spectrumId === uvvis.selectedWaveLength ? updatedSpectrum : uvvis.currentSpectrum
    }
  };
};
const clearIntegrationAllHplcMs = state => {
  const {
    uvvis
  } = state;
  if (!uvvis || !Array.isArray(uvvis.spectraList)) {
    return state;
  }
  const newSpectraList = uvvis.spectraList.map(spectrum => ({
    ...spectrum,
    integrations: []
  }));
  const newUvvis = {
    ...uvvis,
    spectraList: newSpectraList,
    currentSpectrum: newSpectraList[uvvis.wavelengthIdx] || null
  };
  return {
    ...state,
    uvvis: newUvvis
  };
};
const clearAllPeaksHplcMs = state => {
  const {
    uvvis
  } = state;
  if (!uvvis || !Array.isArray(uvvis.spectraList)) {
    return state;
  }
  const newSpectraList = uvvis.spectraList.map(spectrum => ({
    ...spectrum,
    peaks: []
  }));
  return {
    ...state,
    uvvis: {
      ...uvvis,
      spectraList: newSpectraList,
      currentSpectrum: newSpectraList[uvvis.wavelengthIdx] || null
    }
  };
};
const hplcMsReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.CURVE.SET_ALL_CURVES:
      return updateHPLCData(state, action);
    case _action_type.HPLC_MS.UPDATE_UVVIS_WAVE_LENGTH:
      return updateWaveLength(state, action);
    case _action_type.HPLC_MS.SELECT_TIC_CURVE:
      return updateTic(state, action);
    case _action_type.HPLC_MS.UPDATE_CURRENT_PAGE_VALUE:
      return updateCurrentPageValue(state, action);
    case _action_type.HPLC_MS.UPDATE_HPLCMS_INTEGRATIONS:
      return updateHplcMsIntegrations(state, action);
    case _action_type.HPLC_MS.UPDATE_HPLCMS_PEAKS:
      return updateHplcMsPeaks(state, action);
    case _action_type.HPLC_MS.REMOVE_HPLCMS_PEAK:
      return removeHplcMsPeak(state, action);
    case _action_type.HPLC_MS.CLEAR_INTEGRATION_ALL_HPLCMS:
      return clearIntegrationAllHplcMs(state);
    case _action_type.THRESHOLD.UPDATE_VALUE:
      return updateThresholdValue(state, action);
    case _action_type.THRESHOLD.RESET_VALUE:
      return resetThresholdValue(state);
    case _action_type.HPLC_MS.CLEAR_ALL_PEAKS_HPLCMS:
      return clearAllPeaksHplcMs(state);
    default:
      return state;
  }
};
var _default = exports.default = hplcMsReducer;