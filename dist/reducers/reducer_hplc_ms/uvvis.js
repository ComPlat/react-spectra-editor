"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uvvisUndo = exports.uvvisRedo = exports.updateWavelength = exports.updateHplcMsPeaks = exports.updateHplcMsIntegrations = exports.removeHplcMsPeak = exports.recordUvvisEditBefore = exports.emptyUvvisHistory = exports.clearIntegrationAllHplcMs = exports.clearAllPeaksHplcMs = void 0;
var _integration = require("../../helpers/integration");
var _utils = require("./utils");
var _persistence = require("./persistence");
/* eslint-disable prefer-object-spread, default-param-last */

const MAX_UVVIS_UNDO = 50;
const emptyUvvisHistory = () => ({
  past: [],
  future: []
});
exports.emptyUvvisHistory = emptyUvvisHistory;
const captureUvvisEditSnapshot = state => {
  const {
    uvvis
  } = state;
  const {
    spectraList = [],
    selectedWaveLength,
    wavelengthIdx
  } = uvvis;
  return {
    selectedWaveLength,
    wavelengthIdx,
    spectraList: spectraList.map(sp => ({
      peaks: (sp.peaks || []).map(p => ({
        ...p
      })),
      integrations: JSON.parse(JSON.stringify(sp.integrations || []))
    }))
  };
};
const restoreUvvisEditSnapshot = (state, snap) => {
  const {
    uvvis
  } = state;
  const newSpectraList = uvvis.spectraList.map((sp, i) => {
    const p = snap.spectraList[i];
    if (!p) return sp;
    return {
      ...sp,
      peaks: (p.peaks || []).map(x => ({
        ...x
      })),
      integrations: JSON.parse(JSON.stringify(p.integrations || []))
    };
  });
  const wlIdx = Number.isInteger(snap.wavelengthIdx) ? snap.wavelengthIdx : 0;
  const safeIdx = wlIdx >= 0 && wlIdx < newSpectraList.length ? wlIdx : 0;
  const currentSpectrum = newSpectraList[safeIdx] || null;
  return {
    ...state,
    uvvis: {
      ...uvvis,
      selectedWaveLength: snap.selectedWaveLength,
      wavelengthIdx: safeIdx,
      spectraList: newSpectraList,
      currentSpectrum
    }
  };
};
const recordUvvisEditBefore = state => {
  const hist = state.uvvisEditHistory || emptyUvvisHistory();
  const snap = captureUvvisEditSnapshot(state);
  const past = [...hist.past, snap].slice(-MAX_UVVIS_UNDO);
  return {
    ...state,
    uvvisEditHistory: {
      past,
      future: []
    }
  };
};
exports.recordUvvisEditBefore = recordUvvisEditBefore;
const uvvisUndo = state => {
  const hist = state.uvvisEditHistory || emptyUvvisHistory();
  if (!hist.past.length) return state;
  const past = [...hist.past];
  const prior = past.pop();
  const currentSnap = captureUvvisEditSnapshot(state);
  const future = [currentSnap, ...hist.future];
  const restored = restoreUvvisEditSnapshot(state, prior);
  return {
    ...restored,
    uvvisEditHistory: {
      past,
      future
    }
  };
};
exports.uvvisUndo = uvvisUndo;
const uvvisRedo = state => {
  const hist = state.uvvisEditHistory || emptyUvvisHistory();
  if (!hist.future.length) return state;
  const [next, ...restFuture] = hist.future;
  const past = [...hist.past, captureUvvisEditSnapshot(state)].slice(-MAX_UVVIS_UNDO);
  const restored = restoreUvvisEditSnapshot(state, next);
  return {
    ...restored,
    uvvisEditHistory: {
      past,
      future: restFuture
    }
  };
};
exports.uvvisRedo = uvvisRedo;
const updateHplcMsPeaks = (state, action) => {
  const {
    spectrumId,
    peaks
  } = action.payload || {};
  const {
    uvvis
  } = state;
  const {
    spectraList = [],
    listWaveLength = []
  } = uvvis;
  const normalizedSpectrumId = (0, _utils.normalizeSpectrumId)(spectrumId);
  const spectrumIndex = listWaveLength.map(waveLength => (0, _utils.normalizeSpectrumId)(waveLength)).indexOf(normalizedSpectrumId);
  if (spectrumIndex === -1) return state;
  const st = action.meta?.skipUvvisHistory ? state : recordUvvisEditBefore(state);
  const newSpectraList = [...spectraList];
  const updatedSpectrum = {
    ...newSpectraList[spectrumIndex],
    peaks
  };
  newSpectraList[spectrumIndex] = updatedSpectrum;
  const newCurrentSpectrum = (0, _utils.normalizeSpectrumId)(uvvis.selectedWaveLength) === normalizedSpectrumId ? updatedSpectrum : uvvis.currentSpectrum;
  return {
    ...st,
    uvvis: {
      ...uvvis,
      spectraList: newSpectraList,
      currentSpectrum: newCurrentSpectrum
    }
  };
};
exports.updateHplcMsPeaks = updateHplcMsPeaks;
const updateWavelength = (state, action) => {
  const {
    payload
  } = action;
  if (payload?.target) {
    const {
      value
    } = payload.target;
    const {
      uvvis
    } = state;
    const {
      listWaveLength = [],
      spectraList = []
    } = uvvis;
    const normalizedValue = (0, _utils.normalizeSpectrumId)(value);
    const normalizedWaveLengths = listWaveLength.map(waveLength => (0, _utils.normalizeSpectrumId)(waveLength));
    const wavelengthIdx = normalizedWaveLengths.indexOf(normalizedValue);
    const currentSpectrum = spectraList.find((spectrum, index) => normalizedWaveLengths[index] === normalizedValue);
    const next = {
      ...state,
      uvvis: {
        ...uvvis,
        selectedWaveLength: normalizedValue,
        wavelengthIdx,
        spectraList,
        currentSpectrum
      }
    };
    (0, _persistence.persistLcmsUvvisWavelength)(state.lcmsDatasetKey, normalizedValue);
    return next;
  }
  return state;
};
exports.updateWavelength = updateWavelength;
const updateHplcMsIntegrations = (state, action) => {
  const {
    spectrumId,
    integration,
    remove,
    shift = 0
  } = action.payload || {};
  const {
    uvvis
  } = state;
  const {
    spectraList = [],
    listWaveLength = []
  } = uvvis;
  const normalizedSpectrumId = (0, _utils.normalizeSpectrumId)(spectrumId);
  const curveIdx = listWaveLength.map(waveLength => (0, _utils.normalizeSpectrumId)(waveLength)).indexOf(normalizedSpectrumId);
  if (curveIdx === -1) {
    return state;
  }
  const selectedSpectrum = spectraList[curveIdx];
  if (!selectedSpectrum) {
    return state;
  }
  const getRange = intg => {
    const xL = intg?.xExtent?.xL ?? intg?.xL;
    const xU = intg?.xExtent?.xU ?? intg?.xU;
    return {
      xL,
      xU
    };
  };
  if (remove) {
    const {
      xL: rmXL,
      xU: rmXU
    } = getRange(integration);
    if (rmXL == null || rmXU == null) return state;
    const stRm = action.meta?.skipUvvisHistory ? state : recordUvvisEditBefore(state);
    const uvRm = stRm.uvvis;
    const spListRm = uvRm.spectraList;
    const specRm = spListRm[curveIdx];
    const intRm = specRm.integrations || [];
    const newIntegrations = intRm.filter(intg => {
      const {
        xL,
        xU
      } = getRange(intg);
      if (xL == null || xU == null) return true;
      return !(Math.abs(xL - rmXL) < 1e-6 && Math.abs(xU - rmXU) < 1e-6);
    });
    const newSpectrum = {
      ...specRm,
      integrations: newIntegrations
    };
    const newSpectraList = [...spListRm];
    newSpectraList[curveIdx] = newSpectrum;
    return {
      ...stRm,
      uvvis: {
        ...uvRm,
        spectraList: newSpectraList,
        currentSpectrum: (0, _utils.normalizeSpectrumId)(uvRm.selectedWaveLength) === normalizedSpectrumId ? newSpectrum : uvRm.currentSpectrum
      }
    };
  }
  if (!integration) {
    return state;
  }
  const {
    xExtent,
    data
  } = integration;
  if (!xExtent || !data || xExtent.xL == null || xExtent.xU == null || xExtent.xU === xExtent.xL) {
    return state;
  }
  const stAdd = action.meta?.skipUvvisHistory ? state : recordUvvisEditBefore(state);
  const uvAdd = stAdd.uvvis;
  const spListAdd = uvAdd.spectraList;
  const specAdd = spListAdd[curveIdx];
  const integrationsAdd = specAdd.integrations || [];
  const {
    xL,
    xU
  } = xExtent;
  const area = (0, _integration.getArea)(xL, xU, data);
  const absoluteArea = (0, _integration.getAbsoluteArea)(xL, xU, data);
  const isFirst = integrationsAdd.length === 0;
  const newIntegration = {
    xL: xL + shift,
    xU: xU + shift,
    area,
    absoluteArea,
    refArea: isFirst ? area : integrationsAdd[0]?.refArea ?? area,
    xExtent,
    data
  };
  const newIntegrations = [...integrationsAdd, newIntegration];
  const newSpectrum = {
    ...specAdd,
    integrations: newIntegrations
  };
  const newSpectraList = [...spListAdd];
  newSpectraList[curveIdx] = newSpectrum;
  return {
    ...stAdd,
    uvvis: {
      ...uvAdd,
      spectraList: newSpectraList,
      currentSpectrum: (0, _utils.normalizeSpectrumId)(uvAdd.selectedWaveLength) === normalizedSpectrumId ? newSpectrum : uvAdd.currentSpectrum
    }
  };
};
exports.updateHplcMsIntegrations = updateHplcMsIntegrations;
const removeHplcMsPeak = (state, action) => {
  const {
    spectrumId,
    peak
  } = action.payload || {};
  const {
    uvvis
  } = state;
  const {
    spectraList = [],
    listWaveLength = []
  } = uvvis;
  const normalizedSpectrumId = (0, _utils.normalizeSpectrumId)(spectrumId);
  const index = listWaveLength.map(waveLength => (0, _utils.normalizeSpectrumId)(waveLength)).indexOf(normalizedSpectrumId);
  if (index === -1) return state;
  const spectrum = spectraList[index];
  if (!spectrum || !Array.isArray(spectrum.peaks) || !peak) return state;
  const stPk = action.meta?.skipUvvisHistory ? state : recordUvvisEditBefore(state);
  const uvPk = stPk.uvvis;
  const spListPk = uvPk.spectraList;
  const spectrumPk = spListPk[index];
  const filteredPeaks = spectrumPk.peaks.filter(p => !(Math.abs(p.x - peak.x) < 1e-6 && Math.abs(p.y - peak.y) < 1e-6));
  const updatedSpectrum = {
    ...spectrumPk,
    peaks: filteredPeaks
  };
  const updatedSpectraList = [...spListPk];
  updatedSpectraList[index] = updatedSpectrum;
  return {
    ...stPk,
    uvvis: {
      ...uvPk,
      spectraList: updatedSpectraList,
      currentSpectrum: (0, _utils.normalizeSpectrumId)(uvPk.selectedWaveLength) === normalizedSpectrumId ? updatedSpectrum : uvPk.currentSpectrum
    }
  };
};
exports.removeHplcMsPeak = removeHplcMsPeak;
const clearIntegrationAllHplcMs = (state, action = {}) => {
  const {
    uvvis
  } = state;
  if (!uvvis || !Array.isArray(uvvis.spectraList)) {
    return state;
  }
  const stCl = action.meta?.skipUvvisHistory ? state : recordUvvisEditBefore(state);
  const uvCl = stCl.uvvis;
  const newSpectraList = uvCl.spectraList.map(spectrum => ({
    ...spectrum,
    integrations: []
  }));
  const newUvvis = {
    ...uvCl,
    spectraList: newSpectraList,
    currentSpectrum: newSpectraList[uvCl.wavelengthIdx] || null
  };
  return {
    ...stCl,
    uvvis: newUvvis
  };
};
exports.clearIntegrationAllHplcMs = clearIntegrationAllHplcMs;
const clearAllPeaksHplcMs = (state, action = {}) => {
  const {
    uvvis
  } = state;
  if (!uvvis || !Array.isArray(uvvis.spectraList)) {
    return state;
  }
  const stPkAll = action.meta?.skipUvvisHistory ? state : recordUvvisEditBefore(state);
  const uvPkAll = stPkAll.uvvis;
  const newSpectraList = uvPkAll.spectraList.map(spectrum => ({
    ...spectrum,
    peaks: []
  }));
  return {
    ...stPkAll,
    uvvis: {
      ...uvPkAll,
      spectraList: newSpectraList,
      currentSpectrum: newSpectraList[uvPkAll.wavelengthIdx] || null
    }
  };
};
exports.clearAllPeaksHplcMs = clearAllPeaksHplcMs;