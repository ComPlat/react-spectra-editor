/* eslint-disable prefer-object-spread, import/prefer-default-export */
import { getLcMsInfo } from '../../helpers/extractEntityLCMS';
import {
  normalizeSpectrumId,
  readFiniteNumber,
  normalizeHintPolarity,
  pickFirstAvailablePolarity,
  pickFirstRtOnAxis,
  snapRtToAxis,
} from './utils';
import {
  persistLcmsUvvisWavelength,
  readPersistedLcmsUvvisWavelength,
  readPersistedLastLcmsUvvisWavelength,
  readPersistedLcmsTicHints,
} from './persistence';
import { emptyUvvisHistory } from './uvvis';
import { parseFeaturePageValue } from '../../features/lc-ms/parsing/pageValue';

export const updateLcmsData = (state, action) => {
  const { payload, meta: actionMeta } = action;
  if (!payload || payload.length === 0) return state;
  const meta = actionMeta && typeof actionMeta === 'object' ? actionMeta : {};

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

  if (!uvvisCurve || !uvvisCurve.features) return state;
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

  const prevUvvis = state.uvvis || {};
  const nextDatasetKey = meta.idDt ?? meta.datasetId ?? state.lcmsDatasetKey ?? null;

  const sameDatasetScope = nextDatasetKey === state.lcmsDatasetKey
    || (nextDatasetKey == null && state.lcmsDatasetKey == null);

  const prevSpectraById = (() => {
    const map = new Map();
    if (!sameDatasetScope) return map;
    const prevList = prevUvvis.spectraList || [];
    const prevWls = prevUvvis.listWaveLength || [];
    for (let i = 0; i < prevList.length; i += 1) {
      const sp = prevList[i];
      if (!sp) continue; // eslint-disable-line no-continue
      const wl = prevWls[i];
      const id = normalizeSpectrumId(wl ?? sp.pageValue);
      map.set(id, sp);
    }
    return map;
  })();

  const spectraList = filteredFeatures.map((fe) => {
    const pageValue = getPageValue(fe);
    const id = normalizeSpectrumId(pageValue);
    const fromServer = {
      data: fe.data[0],
      integrations: fe.integrations || [],
      peaks: fe.peaks || [],
      pageValue,
    };
    const prevSp = prevSpectraById.get(id);
    if (!prevSp) {
      return fromServer;
    }
    return {
      ...fromServer,
      data: fe.data[0],
      integrations: JSON.parse(JSON.stringify(prevSp.integrations || [])),
      peaks: (prevSp.peaks || []).map((p) => ({ ...p })),
    };
  });
  const normalizedNew = listWaveLength.map((w) => normalizeSpectrumId(w));

  const metaWlHint = readFiniteNumber(meta.lcmsUvvisWavelength ?? meta.lcms_uvvis_wavelength);
  const curveWlHint = (() => {
    const c = uvvisCurve;
    const v = readFiniteNumber(c?.lcms_uvvis_wavelength ?? c?.lcmsUvvisWavelength)
      ?? readFiniteNumber(c?.entity?.lcms_uvvis_wavelength ?? c?.entity?.lcmsUvvisWavelength);
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
    currentSpectrum,
  };

  const toMsPayload = (fts) => {
    const peaks = [];
    const pageValues = [];
    fts.forEach((feature) => {
      const data = feature?.data?.[0] || {};
      const xValues = Array.isArray(data.x) ? data.x : [];
      const yValues = Array.isArray(data.y) ? data.y : [];
      const length = Math.min(xValues.length, yValues.length);
      peaks.push(
        xValues.slice(0, length).map((x, i) => ({
          x,
          y: yValues[i] || 0,
        })),
      );
      pageValues.push(parseFeaturePageValue(feature));
    });
    return { peaks, pageValues };
  };

  const available = {
    positive: ticPosData?.x?.length > 0,
    negative: ticNegData?.x?.length > 0,
    neutral: ticNeutralData?.x?.length > 0,
  };
  const preferredOrder = ['positive', 'negative', 'neutral'];
  const fallbackPolarity = preferredOrder.find((pol) => available[pol]) || 'positive';

  const readMetaPolarity = () => normalizeHintPolarity(
    meta.lcmsPolarity ?? meta.lcms_polarity ?? meta.ticPolarity,
  );
  const metaPol = readMetaPolarity();
  const persistedTicHints = readPersistedLcmsTicHints(nextDatasetKey);

  const selectedPolarity = pickFirstAvailablePolarity(
    available,
    [
      metaPol,
      normalizeHintPolarity(persistedTicHints?.polarity),
      state.tic?.polarity,
    ],
  ) || fallbackPolarity;

  const ticXsFor = (pol) => {
    if (pol === 'negative') return ticNegData?.x;
    if (pol === 'neutral') return ticNeutralData?.x;
    return ticPosData?.x;
  };
  const nextRtXs = ticXsFor(selectedPolarity) || [];

  const rtHintFromMzCurve = (pol) => {
    const c = payload.find((curve) => {
      const inf = getLcMsInfo(curve);
      return inf.kind === 'mz' && inf.polarity === pol;
    });
    if (!c) return null;
    return readFiniteNumber(
      c.lcms_mz_page ?? c.lcmsMzPage ?? c.entity?.lcms_mz_page ?? c.entity?.lcmsMzPage,
    );
  };

  const rtFromMzFeature = (pol) => {
    const findIn = (list) => {
      if (!Array.isArray(list)) return null;
      for (let i = 0; i < list.length; i += 1) {
        const v = parseFeaturePageValue(list[i]);
        if (Number.isFinite(v)) return v;
      }
      return null;
    };
    if (pol === 'negative') return findIn(mzNegFeatures);
    if (pol === 'neutral') return findIn(mzNeutralFeatures);
    return findIn(mzPosFeatures);
  };

  const metaRt = readFiniteNumber(meta.lcms_mz_page ?? meta.lcmsMzPage);
  const curveRt = rtHintFromMzCurve(selectedPolarity);
  const uvvisRtHint = readFiniteNumber(
    uvvisCurve?.lcms_mz_page ?? uvvisCurve?.lcmsMzPage
      ?? uvvisCurve?.entity?.lcms_mz_page ?? uvvisCurve?.entity?.lcmsMzPage,
  );
  const mzFeatureRt = rtFromMzFeature(selectedPolarity)
    ?? rtFromMzFeature('positive')
    ?? rtFromMzFeature('negative')
    ?? rtFromMzFeature('neutral');

  const fromHints = pickFirstRtOnAxis(
    [metaRt, uvvisRtHint, curveRt],
    nextRtXs,
  ) ?? nextRtXs[0] ?? null;

  const persistedMzPage = readFiniteNumber(persistedTicHints?.mzPage);

  const prevPageFromState = sameDatasetScope
    ? readFiniteNumber(state.tic?.currentPageValue)
    : null;

  let nextCurrentPageValue = fromHints;
  const snappedState = snapRtToAxis(prevPageFromState, nextRtXs);
  const snappedPersisted = snapRtToAxis(persistedMzPage, nextRtXs);
  if (snappedState != null) {
    nextCurrentPageValue = snappedState;
  } else if (snappedPersisted != null) {
    nextCurrentPageValue = snappedPersisted;
  }

  if (Number.isFinite(mzFeatureRt)) {
    nextCurrentPageValue = mzFeatureRt;
  }

  const sameDataset = nextDatasetKey != null
    && state.lcmsDatasetKey != null
    && nextDatasetKey === state.lcmsDatasetKey;

  return {
    ...state,
    lcmsDatasetKey: nextDatasetKey,
    uvvis: newUvvis,
    uvvisEditHistory: sameDataset
      ? (state.uvvisEditHistory || emptyUvvisHistory())
      : emptyUvvisHistory(),
    ms: {
      positive: toMsPayload(mzPosFeatures),
      negative: toMsPayload(mzNegFeatures),
      neutral: toMsPayload(mzNeutralFeatures),
    },
    tic: {
      ...state.tic,
      currentPageValue: nextCurrentPageValue,
      polarity: selectedPolarity,
      available,
      positive: { data: ticPosData },
      negative: { data: ticNegData },
      neutral: { data: ticNeutralData },
    },
  };
};
