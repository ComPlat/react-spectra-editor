/* eslint-disable prefer-object-spread, default-param-last */
import { HPLC_MS, CURVE, THRESHOLD } from '../constants/action_type';
import { getArea, getAbsoluteArea } from '../helpers/integration';
import { getLcMsInfo } from '../helpers/extractEntityLCMS';

const initialState = {
  uvvis: {
    listWaveLength: null,
    selectedWaveLength: null,
    wavelengthIdx: 0,
    spectraList: [],
    currentSpectrum: null,
  },
  ms: {
    positive: { peaks: [] },
    negative: { peaks: [] },
    neutral: { peaks: [] },
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
  layout: 'LC/MS',
};

const updateHPLCData = (state, action) => {
  const { payload } = action;
  if (!payload || payload.length === 0) return state;

  const normalizeFeatures = (curve) => {
    if (Array.isArray(curve?.features)) return curve.features;
    if (Array.isArray(curve?.spectra)) return curve.spectra;
    if (curve?.feature) return [curve.feature];
    if (curve?.entity?.features) {
      if (Array.isArray(curve.entity.features)) return curve.entity.features;
      if (typeof curve.entity.features === 'object') {
        return Object.values(curve.entity.features).filter((f) => f?.data?.[0]);
      }
    }
    if (curve?.features && typeof curve.features === 'object') {
      return Object.values(curve.features).filter((f) => f?.data?.[0]);
    }
    return [];
  };

  let ticPosData = { x: [], y: [] };
  let ticNegData = { x: [], y: [] };
  let ticNeutralData = { x: [], y: [] };

  let uvvisCurve = null;
  const mzPosFeatures = [];
  const mzNegFeatures = [];
  const mzNeutralFeatures = [];

  payload.forEach((curve) => {
    const { kind, polarity } = getLcMsInfo(curve);
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
        features: featuresArr,
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
  const { features } = uvvisCurve;

  const getPageValue = (fe) => {
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

  const filteredFeatures = features.filter((fe) => (
    fe.data
    && fe.data[0]
    && fe.data[0].x
    && fe.data[0].x.length > 0
    && fe.data[0].y
    && fe.data[0].y.length > 0
  ));

  const listWaveLength = filteredFeatures.map((fe) => getPageValue(fe));
  const spectraList = filteredFeatures.map((fe) => ({
    data: fe.data[0],
    integrations: fe.integrations || [],
    peaks: fe.peaks || [],
    pageValue: getPageValue(fe),
  }));

  const newUvvis = {
    ...state.uvvis,
    listWaveLength,
    selectedWaveLength: listWaveLength[0],
    wavelengthIdx: 0,
    spectraList,
    currentSpectrum: spectraList[0],
  };

  const toPeaks = (fts) => fts.map((f) => {
    const data = f?.data?.[0] || {};
    const xValues = Array.isArray(data.x) ? data.x : [];
    const yValues = Array.isArray(data.y) ? data.y : [];
    const length = Math.min(xValues.length, yValues.length);
    return xValues.slice(0, length).map((x, i) => ({
      x,
      y: yValues[i] || 0,
    }));
  });

  const available = {
    positive: ticPosData?.x?.length > 0,
    negative: ticNegData?.x?.length > 0,
    neutral: ticNeutralData?.x?.length > 0,
  };
  const preferredOrder = ['positive', 'negative', 'neutral'];
  const fallbackPolarity = preferredOrder.find((pol) => available[pol]) || 'positive';
  const selectedPolarity = available[state.tic.polarity] ? state.tic.polarity : fallbackPolarity;

  return {
    ...state,
    uvvis: newUvvis,
    ms: {
      positive: { peaks: toPeaks(mzPosFeatures) },
      negative: { peaks: toPeaks(mzNegFeatures) },
      neutral: { peaks: toPeaks(mzNeutralFeatures) },
    },
    tic: {
      ...state.tic,
      polarity: selectedPolarity,
      available,
      positive: { data: ticPosData },
      negative: { data: ticNegData },
      neutral: { data: ticNeutralData },
    },
  };
};

const updateHplcMsPeaks = (state, action) => {
  const { spectrumId, peaks } = action.payload;

  const { uvvis } = state;
  const { spectraList, listWaveLength } = uvvis;
  const spectrumIndex = listWaveLength.indexOf(spectrumId);

  if (spectrumIndex === -1) return state;

  const newSpectraList = [...spectraList];
  const updatedSpectrum = {
    ...newSpectraList[spectrumIndex],
    peaks,
  };
  newSpectraList[spectrumIndex] = updatedSpectrum;

  const newCurrentSpectrum = spectrumId === uvvis.selectedWaveLength
    ? updatedSpectrum
    : uvvis.currentSpectrum;

  return {
    ...state,
    uvvis: {
      ...uvvis,
      spectraList: newSpectraList,
      currentSpectrum: newCurrentSpectrum,
    },
  };
};

const updateWaveLength = (state, action) => {
  const { payload } = action;
  if (payload) {
    const { value } = payload.target;
    const { uvvis } = state;
    const { listWaveLength, spectraList } = uvvis;
    const wavelengthIdx = listWaveLength.indexOf(value);

    const currentSpectrum = spectraList.find(
      (spectrum, index) => listWaveLength[index] === value,
    );

    return {
      ...state,
      uvvis: {
        ...uvvis,
        selectedWaveLength: value,
        wavelengthIdx,
        spectraList,
        currentSpectrum,
      },
    };
  }
  return state;
};

const updateTic = (state, action) => {
  const { polarity } = action.payload;
  return {
    ...state,
    tic: {
      ...state.tic,
      polarity,
    },
  };
};

const updateCurrentPageValue = (state, action) => {
  const { currentPageValue } = action.payload;
  return {
    ...state,
    tic: {
      ...state.tic,
      currentPageValue,
    },
  };
};

const updateThresholdValue = (state, action) => {
  const { payload } = action;
  if (payload) {
    const { value } = payload;
    return {
      ...state,
      threshold: {
        isEdit: true,
        value,
        originalValue: state.threshold.originalValue ?? value,
      },
    };
  }
  return state;
};

const resetThresholdValue = (state) => ({
  ...state,
  threshold: {
    isEdit: true,
    value: state.threshold.originalValue,
    originalValue: state.threshold.originalValue,
  },
});

const updateHplcMsIntegrations = (state, action) => {
  const {
    spectrumId, integration, remove, shift = 0,
  } = action.payload;

  const { uvvis } = state;
  const { spectraList, listWaveLength } = uvvis;

  const curveIdx = listWaveLength.indexOf(spectrumId);
  if (curveIdx === -1) {
    return state;
  }

  const selectedSpectrum = spectraList[curveIdx];

  if (!selectedSpectrum) {
    return state;
  }

  const { integrations = [] } = selectedSpectrum;

  const getRange = (intg) => {
    const xL = intg?.xExtent?.xL ?? intg?.xL;
    const xU = intg?.xExtent?.xU ?? intg?.xU;
    return { xL, xU };
  };

  if (remove) {
    const { xL: rmXL, xU: rmXU } = getRange(integration);
    if (rmXL == null || rmXU == null) return state;
    const newIntegrations = integrations.filter((intg) => {
      const { xL, xU } = getRange(intg);
      if (xL == null || xU == null) return true;
      return !(Math.abs(xL - rmXL) < 1e-6 && Math.abs(xU - rmXU) < 1e-6);
    });

    const newSpectrum = {
      ...selectedSpectrum,
      integrations: newIntegrations,
    };

    const newSpectraList = [...spectraList];
    newSpectraList[curveIdx] = newSpectrum;

    return {
      ...state,
      uvvis: {
        ...uvvis,
        spectraList: newSpectraList,
        currentSpectrum:
          spectrumId === uvvis.selectedWaveLength ? newSpectrum : uvvis.currentSpectrum,
      },
    };
  }

  const { xExtent, data } = integration;
  if (!xExtent || !data || !xExtent.xL || !xExtent.xU || xExtent.xU === xExtent.xL) {
    return state;
  }

  const { xL, xU } = xExtent;
  const area = getArea(xL, xU, data);
  const absoluteArea = getAbsoluteArea(xL, xU, data);
  const isFirst = integrations.length === 0;

  const newIntegration = {
    xL: xL + shift,
    xU: xU + shift,
    area,
    absoluteArea,
    refArea: isFirst ? area : integrations[0]?.refArea ?? area,
    xExtent,
    data,
  };

  const newIntegrations = [...integrations, newIntegration];

  const newSpectrum = {
    ...selectedSpectrum,
    integrations: newIntegrations,
  };

  const newSpectraList = [...spectraList];
  newSpectraList[curveIdx] = newSpectrum;

  return {
    ...state,
    uvvis: {
      ...uvvis,
      spectraList: newSpectraList,
      currentSpectrum:
        spectrumId === uvvis.selectedWaveLength ? newSpectrum : uvvis.currentSpectrum,
    },
  };
};

const removeHplcMsPeak = (state, action) => {
  const { spectrumId, peak } = action.payload;
  const { uvvis } = state;
  const { spectraList, listWaveLength } = uvvis;

  const index = listWaveLength.indexOf(spectrumId);
  if (index === -1) return state;

  const spectrum = spectraList[index];
  const filteredPeaks = spectrum.peaks.filter(
    (p) => !(Math.abs(p.x - peak.x) < 1e-6 && Math.abs(p.y - peak.y) < 1e-6),
  );

  const updatedSpectrum = {
    ...spectrum,
    peaks: filteredPeaks,
  };

  const updatedSpectraList = [...spectraList];
  updatedSpectraList[index] = updatedSpectrum;

  return {
    ...state,
    uvvis: {
      ...uvvis,
      spectraList: updatedSpectraList,
      currentSpectrum: spectrumId === uvvis.selectedWaveLength
        ? updatedSpectrum : uvvis.currentSpectrum,
    },
  };
};

const clearIntegrationAllHplcMs = (state) => {
  const { uvvis } = state;

  if (!uvvis || !Array.isArray(uvvis.spectraList)) {
    return state;
  }

  const newSpectraList = uvvis.spectraList.map((spectrum) => ({
    ...spectrum,
    integrations: [],
  }));

  const newUvvis = {
    ...uvvis,
    spectraList: newSpectraList,
    currentSpectrum: newSpectraList[uvvis.wavelengthIdx] || null,
  };

  return {
    ...state,
    uvvis: newUvvis,
  };
};

const clearAllPeaksHplcMs = (state) => {
  const { uvvis } = state;
  if (!uvvis || !Array.isArray(uvvis.spectraList)) {
    return state;
  }

  const newSpectraList = uvvis.spectraList.map((spectrum) => ({
    ...spectrum,
    peaks: [],
  }));

  return {
    ...state,
    uvvis: {
      ...uvvis,
      spectraList: newSpectraList,
      currentSpectrum: newSpectraList[uvvis.wavelengthIdx] || null,
    },
  };
};

const hplcMsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURVE.SET_ALL_CURVES:
      return updateHPLCData(state, action);
    case HPLC_MS.UPDATE_UVVIS_WAVE_LENGTH:
      return updateWaveLength(state, action);
    case HPLC_MS.SELECT_TIC_CURVE:
      return updateTic(state, action);
    case HPLC_MS.UPDATE_CURRENT_PAGE_VALUE:
      return updateCurrentPageValue(state, action);
    case HPLC_MS.UPDATE_HPLCMS_INTEGRATIONS:
      return updateHplcMsIntegrations(state, action);
    case HPLC_MS.UPDATE_HPLCMS_PEAKS:
      return updateHplcMsPeaks(state, action);
    case HPLC_MS.REMOVE_HPLCMS_PEAK:
      return removeHplcMsPeak(state, action);
    case HPLC_MS.CLEAR_INTEGRATION_ALL_HPLCMS:
      return clearIntegrationAllHplcMs(state);
    case THRESHOLD.UPDATE_VALUE:
      return updateThresholdValue(state, action);
    case THRESHOLD.RESET_VALUE:
      return resetThresholdValue(state);
    case HPLC_MS.CLEAR_ALL_PEAKS_HPLCMS:
      return clearAllPeaksHplcMs(state);
    default:
      return state;
  }
};

export default hplcMsReducer;
