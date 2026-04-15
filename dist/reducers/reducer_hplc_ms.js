"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
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
    },
    neutral: {
      peaks: []
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
const normalizeSpectrumId = value => {
  if (value == null) return null;
  const numericValue = Number(value);
  if (Number.isFinite(numericValue)) return numericValue;
  return String(value);
};
const LC_WL_STORAGE_PREFIX = 'rsEditor.lcmsUvvisWl:';
const LC_WL_GLOBAL_STORAGE_KEY = 'rsEditor.lcmsUvvisWl:last';
const persistLcmsUvvisWavelength = (datasetKey, wavelength) => {
  if (wavelength == null) return;
  try {
    const normalized = String(normalizeSpectrumId(wavelength));
    sessionStorage.setItem(LC_WL_GLOBAL_STORAGE_KEY, normalized);
    if (datasetKey != null) {
      sessionStorage.setItem(`${LC_WL_STORAGE_PREFIX}${datasetKey}`, normalized);
    }
  } catch (e) {}
};
const readPersistedLcmsUvvisWavelength = datasetKey => {
  if (datasetKey == null) return null;
  try {
    const raw = sessionStorage.getItem(`${LC_WL_STORAGE_PREFIX}${datasetKey}`);
    if (raw == null || raw === '') return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : raw;
  } catch (e) {
    return null;
  }
};
const readPersistedLastLcmsUvvisWavelength = () => {
  try {
    const raw = sessionStorage.getItem(LC_WL_GLOBAL_STORAGE_KEY);
    if (raw == null || raw === '') return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : raw;
  } catch (e) {
    return null;
  }
};
const readFiniteNumber = v => {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const normalizeHintPolarity = v => {
  if (v == null || v === '') return null;
  if (v === 0 || v === '0') return 'positive';
  if (v === 1 || v === '1') return 'negative';
  if (v === 2 || v === '2') return 'neutral';
  const s = String(v).toLowerCase();
  if (s === 'positive' || s === 'pos') return 'positive';
  if (s === 'negative' || s === 'neg') return 'negative';
  if (s === 'neutral' || s === 'neu') return 'neutral';
  return null;
};
const LC_TIC_STORAGE_PREFIX = 'rsEditor.lcmsTic:';
const persistLcmsTicHints = (datasetKey, partial) => {
  if (datasetKey == null) return;
  try {
    const key = `${LC_TIC_STORAGE_PREFIX}${datasetKey}`;
    let cur = {};
    const raw = sessionStorage.getItem(key);
    if (raw) {
      cur = JSON.parse(raw) || {};
    }
    sessionStorage.setItem(key, JSON.stringify({
      ...cur,
      ...partial
    }));
  } catch (e) {}
};
const readPersistedLcmsTicHints = datasetKey => {
  if (datasetKey == null) return {};
  try {
    const raw = sessionStorage.getItem(`${LC_TIC_STORAGE_PREFIX}${datasetKey}`);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};
const pickFirstAvailablePolarity = (available, candidates) => {
  for (let i = 0; i < candidates.length; i += 1) {
    const p = candidates[i];
    if (p && available[p]) return p;
  }
  return null;
};
const pickFirstRtOnAxis = (candidates, xs) => {
  if (!Array.isArray(xs) || xs.length === 0) return null;
  for (let i = 0; i < candidates.length; i += 1) {
    const r = candidates[i];
    if (Number.isFinite(r) && xs.some(x => Math.abs(x - r) < 1e-5)) {
      return r;
    }
  }
  return null;
};
const MAX_UVVIS_UNDO = 50;
const emptyUvvisHistory = () => ({
  past: [],
  future: []
});
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
const updateLcmsData = (state, action) => {
  const {
    payload,
    meta: actionMeta
  } = action;
  if (!payload || payload.length === 0) return state;
  const meta = actionMeta && typeof actionMeta === 'object' ? actionMeta : {};
  const normalizeFeatures = curve => {
    if (Array.isArray(curve?.features)) return curve.features;
    if (Array.isArray(curve?.spectra)) return curve.spectra;
    if (curve?.feature) return [curve.feature];
    if (curve?.entity?.features) {
      if (Array.isArray(curve.entity.features)) return curve.entity.features;
      if (typeof curve.entity.features === 'object') {
        return Object.values(curve.entity.features).filter(f => f?.data?.[0]);
      }
    }
    if (curve?.features && typeof curve.features === 'object') {
      return Object.values(curve.features).filter(f => f?.data?.[0]);
    }
    return [];
  };
  let ticPosData = {
    x: [],
    y: []
  };
  let ticNegData = {
    x: [],
    y: []
  };
  let ticNeutralData = {
    x: [],
    y: []
  };
  let uvvisCurve = null;
  const mzPosFeatures = [];
  const mzNegFeatures = [];
  const mzNeutralFeatures = [];
  payload.forEach(curve => {
    const {
      kind,
      polarity
    } = (0, _extractEntityLCMS.getLcMsInfo)(curve);
    const featuresArr = normalizeFeatures(curve);
    if (kind === 'tic') {
      const [feature] = featuresArr;
      const featureData = feature?.data?.[0];
      if (!featureData || !featureData.x || featureData.x.length === 0) {
        return;
      }
      if (polarity === 'negative') {
        ticNegData = featureData;
      } else if (polarity === 'positive') {
        ticPosData = featureData;
      } else {
        ticNeutralData = featureData;
      }
    } else if (kind === 'uvvis') {
      uvvisCurve = {
        ...curve,
        features: featuresArr
      };
    } else if (kind === 'mz') {
      if (featuresArr.length === 0) return;
      if (polarity === 'negative') {
        mzNegFeatures.push(...featuresArr);
      } else if (polarity === 'positive') {
        mzPosFeatures.push(...featuresArr);
      } else {
        mzNeutralFeatures.push(...featuresArr);
      }
    }
  });
  if (!uvvisCurve || !uvvisCurve.features) {
    return state;
  }
  const {
    features
  } = uvvisCurve;
  const getPageValue = fe => {
    let raw = fe.pageSymbol || fe.page || fe.pageValue;
    if (typeof raw === 'string') {
      raw = raw.split('\n')[0].trim();
      const match = raw.match(/[=:]\s*([0-9.+-]+)/);
      if (match) {
        const [, value] = match;
        raw = value;
      } else {
        raw = raw.replace(/[^0-9.+-]/g, '');
      }
    }
    const value = parseFloat(raw);
    return Number.isFinite(value) ? value : 0;
  };
  const filteredFeatures = features.filter(fe => fe.data && fe.data[0] && fe.data[0].x && fe.data[0].x.length > 0 && fe.data[0].y && fe.data[0].y.length > 0);
  const listWaveLength = filteredFeatures.map(fe => getPageValue(fe));
  const spectraList = filteredFeatures.map(fe => ({
    data: fe.data[0],
    integrations: fe.integrations || [],
    peaks: fe.peaks || [],
    pageValue: getPageValue(fe)
  }));
  const prevUvvis = state.uvvis || {};
  const normalizedNew = listWaveLength.map(w => normalizeSpectrumId(w));
  const nextDatasetKey = meta.idDt ?? meta.datasetId ?? state.lcmsDatasetKey ?? null;
  const metaWlHint = readFiniteNumber(meta.lcmsUvvisWavelength ?? meta.lcms_uvvis_wavelength);
  const curveWlHint = (() => {
    const c = uvvisCurve;
    const v = readFiniteNumber(c?.lcms_uvvis_wavelength ?? c?.lcmsUvvisWavelength) ?? readFiniteNumber(c?.entity?.lcms_uvvis_wavelength ?? c?.entity?.lcmsUvvisWavelength);
    return v;
  })();
  let wavelengthIdx = 0;
  let resolvedFromPrev = false;
  if (prevUvvis.selectedWaveLength != null) {
    const idx = normalizedNew.indexOf(normalizeSpectrumId(prevUvvis.selectedWaveLength));
    if (idx >= 0) {
      wavelengthIdx = idx;
      resolvedFromPrev = true;
    }
  }
  if (!resolvedFromPrev) {
    const persistedWl = readPersistedLcmsUvvisWavelength(nextDatasetKey);
    const persistedLastWl = readPersistedLastLcmsUvvisWavelength();
    const hinted = metaWlHint ?? curveWlHint ?? persistedWl ?? persistedLastWl ?? null;
    if (hinted != null) {
      const idx = normalizedNew.indexOf(normalizeSpectrumId(hinted));
      if (idx >= 0) {
        wavelengthIdx = idx;
      }
    }
  }
  const selectedWaveLength = listWaveLength[wavelengthIdx];
  const currentSpectrum = spectraList[wavelengthIdx];
  persistLcmsUvvisWavelength(nextDatasetKey, selectedWaveLength);
  const newUvvis = {
    ...state.uvvis,
    listWaveLength,
    selectedWaveLength,
    wavelengthIdx,
    spectraList,
    currentSpectrum
  };
  const toPeaks = fts => fts.map(f => {
    const data = f?.data?.[0] || {};
    const xValues = Array.isArray(data.x) ? data.x : [];
    const yValues = Array.isArray(data.y) ? data.y : [];
    const length = Math.min(xValues.length, yValues.length);
    return xValues.slice(0, length).map((x, i) => ({
      x,
      y: yValues[i] || 0
    }));
  });
  const available = {
    positive: ticPosData?.x?.length > 0,
    negative: ticNegData?.x?.length > 0,
    neutral: ticNeutralData?.x?.length > 0
  };
  const preferredOrder = ['positive', 'negative', 'neutral'];
  const fallbackPolarity = preferredOrder.find(pol => available[pol]) || 'positive';
  const readMetaPolarity = () => normalizeHintPolarity(meta.lcmsPolarity ?? meta.lcms_polarity ?? meta.ticPolarity);
  const persistedTicHints = readPersistedLcmsTicHints(nextDatasetKey);
  const persistedPol = normalizeHintPolarity(persistedTicHints.polarity);
  const statePol = available[state.tic.polarity] ? state.tic.polarity : null;
  const metaPol = readMetaPolarity();
  const selectedPolarity = pickFirstAvailablePolarity(available, [metaPol, statePol, persistedPol]) || fallbackPolarity;
  const ticXsFor = pol => {
    if (pol === 'negative') return ticNegData?.x;
    if (pol === 'neutral') return ticNeutralData?.x;
    return ticPosData?.x;
  };
  const nextRtXs = ticXsFor(selectedPolarity) || [];
  const rtHintFromMzCurve = pol => {
    const c = payload.find(curve => {
      const inf = (0, _extractEntityLCMS.getLcMsInfo)(curve);
      return inf.kind === 'mz' && inf.polarity === pol;
    });
    if (!c) return null;
    return readFiniteNumber(c.lcms_mz_page ?? c.lcmsMzPage ?? c.entity?.lcms_mz_page ?? c.entity?.lcmsMzPage);
  };
  const metaRt = readFiniteNumber(meta.lcms_mz_page ?? meta.lcmsMzPage);
  const persistedRt = readFiniteNumber(persistedTicHints.mzPage);
  const curveRt = rtHintFromMzCurve(selectedPolarity);
  const uvvisRtHint = readFiniteNumber(uvvisCurve?.lcms_mz_page ?? uvvisCurve?.lcmsMzPage ?? uvvisCurve?.entity?.lcms_mz_page ?? uvvisCurve?.entity?.lcmsMzPage);
  const stateRt = Number.isFinite(state.tic?.currentPageValue) && nextRtXs.some(x => Math.abs(x - state.tic.currentPageValue) < 1e-5) ? state.tic.currentPageValue : null;
  const nextCurrentPageValue = pickFirstRtOnAxis([metaRt, uvvisRtHint, stateRt, persistedRt, curveRt], nextRtXs);
  return {
    ...state,
    lcmsDatasetKey: nextDatasetKey,
    uvvis: newUvvis,
    uvvisEditHistory: emptyUvvisHistory(),
    ms: {
      positive: {
        peaks: toPeaks(mzPosFeatures)
      },
      negative: {
        peaks: toPeaks(mzNegFeatures)
      },
      neutral: {
        peaks: toPeaks(mzNeutralFeatures)
      }
    },
    tic: {
      ...state.tic,
      currentPageValue: nextCurrentPageValue,
      polarity: selectedPolarity,
      available,
      positive: {
        data: ticPosData
      },
      negative: {
        data: ticNegData
      },
      neutral: {
        data: ticNeutralData
      }
    }
  };
};
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
  const normalizedSpectrumId = normalizeSpectrumId(spectrumId);
  const spectrumIndex = listWaveLength.map(waveLength => normalizeSpectrumId(waveLength)).indexOf(normalizedSpectrumId);
  if (spectrumIndex === -1) return state;
  const st = action.meta?.skipUvvisHistory ? state : recordUvvisEditBefore(state);
  const newSpectraList = [...spectraList];
  const updatedSpectrum = {
    ...newSpectraList[spectrumIndex],
    peaks
  };
  newSpectraList[spectrumIndex] = updatedSpectrum;
  const newCurrentSpectrum = normalizeSpectrumId(uvvis.selectedWaveLength) === normalizedSpectrumId ? updatedSpectrum : uvvis.currentSpectrum;
  return {
    ...st,
    uvvis: {
      ...uvvis,
      spectraList: newSpectraList,
      currentSpectrum: newCurrentSpectrum
    }
  };
};
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
    const normalizedValue = normalizeSpectrumId(value);
    const normalizedWaveLengths = listWaveLength.map(waveLength => normalizeSpectrumId(waveLength));
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
    persistLcmsUvvisWavelength(state.lcmsDatasetKey, normalizedValue);
    return next;
  }
  return state;
};
const updateTic = (state, action) => {
  const {
    polarity
  } = action.payload;
  persistLcmsTicHints(state.lcmsDatasetKey, {
    polarity
  });
  return {
    ...state,
    tic: {
      ...state.tic,
      polarity
    }
  };
};
const updateCurrentPageValue = (state, action) => {
  const {
    currentPageValue
  } = action.payload || {};
  persistLcmsTicHints(state.lcmsDatasetKey, {
    mzPage: currentPageValue
  });
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
  } = action.payload || {};
  const {
    uvvis
  } = state;
  const {
    spectraList = [],
    listWaveLength = []
  } = uvvis;
  const normalizedSpectrumId = normalizeSpectrumId(spectrumId);
  const curveIdx = listWaveLength.map(waveLength => normalizeSpectrumId(waveLength)).indexOf(normalizedSpectrumId);
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
        currentSpectrum: normalizeSpectrumId(uvRm.selectedWaveLength) === normalizedSpectrumId ? newSpectrum : uvRm.currentSpectrum
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
      currentSpectrum: normalizeSpectrumId(uvAdd.selectedWaveLength) === normalizedSpectrumId ? newSpectrum : uvAdd.currentSpectrum
    }
  };
};
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
  const normalizedSpectrumId = normalizeSpectrumId(spectrumId);
  const index = listWaveLength.map(waveLength => normalizeSpectrumId(waveLength)).indexOf(normalizedSpectrumId);
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
      currentSpectrum: normalizeSpectrumId(uvPk.selectedWaveLength) === normalizedSpectrumId ? updatedSpectrum : uvPk.currentSpectrum
    }
  };
};
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
const normalizeLcmsIntegrationsExport = value => ['percent', 'area', 'both'].includes(value) ? value : 'percent';
const hplcMsReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.HPLC_MS.SET_LCMS_INTEGRATIONS_EXPORT:
      {
        const next = normalizeLcmsIntegrationsExport(action.payload?.lcmsIntegrationsExport);
        return {
          ...state,
          lcmsIntegrationsExport: next
        };
      }
    case _action_type.CURVE.SET_ALL_CURVES:
      return updateLcmsData(state, action);
    case _action_type.HPLC_MS.UPDATE_UVVIS_WAVE_LENGTH:
      return updateWavelength(state, action);
    case _action_type.HPLC_MS.SELECT_TIC_CURVE:
      return updateTic(state, action);
    case _action_type.HPLC_MS.UPDATE_CURRENT_PAGE_VALUE:
      return updateCurrentPageValue(state, action);
    case _action_type.HPLC_MS.UVVIS_UNDO:
      return uvvisUndo(state);
    case _action_type.HPLC_MS.UVVIS_REDO:
      return uvvisRedo(state);
    case _action_type.HPLC_MS.UPDATE_HPLCMS_INTEGRATIONS:
      return updateHplcMsIntegrations(state, action);
    case _action_type.HPLC_MS.UPDATE_HPLCMS_PEAKS:
      return updateHplcMsPeaks(state, action);
    case _action_type.HPLC_MS.REMOVE_HPLCMS_PEAK:
      return removeHplcMsPeak(state, action);
    case _action_type.HPLC_MS.CLEAR_INTEGRATION_ALL_HPLCMS:
      return clearIntegrationAllHplcMs(state, action);
    case _action_type.THRESHOLD.UPDATE_VALUE:
      return updateThresholdValue(state, action);
    case _action_type.THRESHOLD.RESET_VALUE:
      return resetThresholdValue(state);
    case _action_type.HPLC_MS.CLEAR_ALL_PEAKS_HPLCMS:
      return clearAllPeaksHplcMs(state, action);
    default:
      return state;
  }
};
var _default = exports.default = hplcMsReducer;