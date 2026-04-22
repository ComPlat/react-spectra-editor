"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectLcmsMsPage = exports.parsePageValue = exports.buildLcmsMsPageJcamp = void 0;
var _extractEntityLCMS = require("../entities/extractEntityLCMS");
const parsePageValue = raw => {
  if (!raw) return null;
  const match = String(raw).match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/);
  return match ? parseFloat(match[0]) : null;
};
exports.parsePageValue = parsePageValue;
const normalizeLcmsRequestPolarity = value => {
  if (value == null || value === '') return null;
  const text = String(value).trim().toLowerCase();
  if (text === 'positive' || text === 'pos' || text === '+') return 'positive';
  if (text === 'negative' || text === 'neg' || text === '-') return 'negative';
  if (text === 'neutral' || text === 'neu' || text === '0') return 'neutral';
  return text || null;
};
const stringifyLcmsPageValue = value => {
  if (value == null) return '';
  return String(value).trim();
};
const getLcmsPageCandidates = (entity = {}) => {
  const spectra = Array.isArray(entity?.spectra) ? entity.spectra : [];
  if (spectra.length > 0) return spectra;
  const features = entity?.features;
  if (Array.isArray(features)) return features;
  if (features && typeof features === 'object') return Object.values(features);
  if (entity?.feature) return [entity.feature];
  return [];
};
const getSpectrumDataPairs = (spectrum = {}) => {
  const data = spectrum?.data?.[0];
  const x = Array.isArray(data?.x) ? data.x : [];
  const y = Array.isArray(data?.y) ? data.y : [];
  const size = Math.min(x.length, y.length);
  return {
    x: x.slice(0, size),
    y: y.slice(0, size)
  };
};
const describeLcmsMsSource = (entity = {}, entityIndex = -1) => {
  const info = (0, _extractEntityLCMS.getLcMsInfo)(entity);
  const title = entity?.title || entity?.info?.TITLE || entity?.info?.$TITLE || 'untitled';
  const scanMode = entity?.scanMode || entity?.SCAN_MODE || entity?.info?.SCAN_MODE || entity?.info?.SCANMODE || '';
  return {
    index: entityIndex,
    kind: info.kind,
    polarity: info.polarity,
    title,
    scanMode,
    spectraCount: getLcmsPageCandidates(entity).length
  };
};
const selectLcmsMsPage = (entities = [], request = {}) => {
  const retentionTimeRaw = stringifyLcmsPageValue(request?.retentionTime);
  const retentionTime = parsePageValue(retentionTimeRaw);
  const polarity = normalizeLcmsRequestPolarity(request?.polarity);
  const tolerance = 1e-5;
  const split = (0, _extractEntityLCMS.splitAndReindexEntities)(entities);
  const mzEntities = split?.mzEntities || [];
  if (mzEntities.length === 0) {
    return {
      retentionTimeRaw,
      retentionTime,
      polarity,
      entity: null,
      entityIndex: -1,
      spectrum: null,
      sourceFallback: false,
      pageFallback: false
    };
  }
  let candidateEntries = mzEntities.map((entity, index) => ({
    entity,
    index
  }));
  let sourceFallback = false;
  if (candidateEntries.length === 1) {
    const onlyPolarity = (0, _extractEntityLCMS.getLcMsInfo)(candidateEntries[0].entity).polarity;
    sourceFallback = polarity != null && polarity !== onlyPolarity;
  } else if (polarity != null) {
    const matchingEntries = candidateEntries.filter(({
      entity
    }) => (0, _extractEntityLCMS.getLcMsInfo)(entity).polarity === polarity);
    if (matchingEntries.length > 0) {
      candidateEntries = matchingEntries;
    } else {
      sourceFallback = true;
    }
  }
  let best = null;
  candidateEntries.forEach(({
    entity,
    index
  }) => {
    getLcmsPageCandidates(entity).forEach((spectrum, spectrumIndex) => {
      const pageValue = parsePageValue(spectrum?.pageValue ?? spectrum?.page ?? spectrum?.pageSymbol);
      const distance = Number.isFinite(retentionTime) && Number.isFinite(pageValue) ? Math.abs(pageValue - retentionTime) : Number.POSITIVE_INFINITY;
      const hasExactMatch = Number.isFinite(distance) && distance <= tolerance;
      if (!best) {
        best = {
          entity,
          entityIndex: index,
          spectrum,
          spectrumIndex,
          pageValue,
          distance,
          hasExactMatch
        };
        return;
      }
      if (hasExactMatch && !best.hasExactMatch) {
        best = {
          entity,
          entityIndex: index,
          spectrum,
          spectrumIndex,
          pageValue,
          distance,
          hasExactMatch
        };
        return;
      }
      if (hasExactMatch === best.hasExactMatch && distance < best.distance) {
        best = {
          entity,
          entityIndex: index,
          spectrum,
          spectrumIndex,
          pageValue,
          distance,
          hasExactMatch
        };
      }
    });
  });
  if (!best) {
    const fallbackEntity = candidateEntries[0]?.entity || mzEntities[0];
    const fallbackEntityIndex = candidateEntries[0]?.index ?? 0;
    const fallbackSpectrum = getLcmsPageCandidates(fallbackEntity)[0] || null;
    return {
      retentionTimeRaw,
      retentionTime,
      polarity,
      entity: fallbackEntity,
      entityIndex: fallbackEntityIndex,
      spectrum: fallbackSpectrum,
      sourceFallback,
      pageFallback: Number.isFinite(retentionTime)
    };
  }
  return {
    retentionTimeRaw,
    retentionTime,
    polarity,
    entity: best.entity,
    entityIndex: best.entityIndex,
    spectrum: best.spectrum,
    sourceFallback,
    pageFallback: Number.isFinite(retentionTime) && !best.hasExactMatch
  };
};
exports.selectLcmsMsPage = selectLcmsMsPage;
const buildLcmsMsPageJcamp = (entities = [], request = {}) => {
  const selection = selectLcmsMsPage(entities, request);
  const {
    retentionTimeRaw,
    retentionTime,
    polarity,
    entity,
    entityIndex,
    spectrum,
    sourceFallback,
    pageFallback
  } = selection;
  const pageHeader = retentionTimeRaw || stringifyLcmsPageValue(spectrum?.pageValue ?? spectrum?.page ?? spectrum?.pageSymbol);
  if (!entity || !spectrum) {
    const emptyResult = {
      jcamp: '',
      selection: {
        retentionTime: retentionTimeRaw,
        polarity,
        msSourceChosen: null,
        pageChosen: null,
        hasPageHeader: false,
        fallbackApplied: sourceFallback || pageFallback
      }
    };
    return emptyResult;
  }
  const {
    x,
    y
  } = getSpectrumDataPairs(spectrum);
  const points = x.map((xValue, index) => `${xValue}, ${y[index]}`);
  const minX = x.length > 0 ? Math.min(...x) : null;
  const maxX = x.length > 0 ? Math.max(...x) : null;
  const minY = y.length > 0 ? Math.min(...y) : null;
  const maxY = y.length > 0 ? Math.max(...y) : null;
  const xUnit = spectrum?.xUnit || entity?.xUnit || entity?.info?.XUNITS || 'm/z';
  const yUnit = spectrum?.yUnit || entity?.yUnit || entity?.info?.YUNITS || 'Intensity';
  const scanMode = spectrum?.scanMode || entity?.scanMode || entity?.info?.SCAN_MODE || entity?.info?.SCANMODE || '';
  const title = spectrum?.title || entity?.title || entity?.info?.TITLE || 'Spectrum';
  const pageChosen = stringifyLcmsPageValue(spectrum?.pageValue ?? spectrum?.page ?? spectrum?.pageSymbol);
  const lines = [`##TITLE=${title}`, '##JCAMP-DX=5.00', '##DATA TYPE=MASS SPECTRUM', '##DATA CLASS=XYPOINTS', '##ORIGIN=Chemspectra', '##OWNER=', `##XUNITS=${xUnit}`, `##YUNITS=${yUnit}`];
  if (scanMode) lines.push(`##SCAN_MODE=${scanMode}`);
  if (pageHeader) lines.push(`##PAGE=${pageHeader}`);
  lines.push(`##NPOINTS=${points.length}`);
  if (minX != null) lines.push(`##FIRSTX=${x[0]}`);
  if (maxX != null) lines.push(`##LASTX=${x[x.length - 1]}`);
  if (minX != null) lines.push(`##MINX=${minX}`);
  if (maxX != null) lines.push(`##MAXX=${maxX}`);
  if (minY != null) lines.push(`##MINY=${minY}`);
  if (maxY != null) lines.push(`##MAXY=${maxY}`);
  if (y.length > 0) lines.push(`##FIRSTY=${y[0]}`);
  lines.push('##XYDATA=(XY..XY)');
  lines.push(...points);
  lines.push('##END=');
  const jcamp = `${lines.join('\n')}\n`;
  const selectionLog = {
    retentionTime: retentionTimeRaw,
    polarity,
    msSourceChosen: describeLcmsMsSource(entity, entityIndex),
    pageChosen: {
      requested: retentionTimeRaw,
      selected: pageChosen,
      numericRequested: Number.isFinite(retentionTime) ? retentionTime : null
    },
    hasPageHeader: pageHeader ? jcamp.includes(`##PAGE=${pageHeader}`) : false,
    fallbackApplied: sourceFallback || pageFallback
  };
  return {
    jcamp,
    selection: selectionLog
  };
};
exports.buildLcmsMsPageJcamp = buildLcmsMsPageJcamp;