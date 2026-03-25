"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.catToString = catToString;
exports.classify = classify;
exports.default = void 0;
exports.getLcMsInfo = getLcMsInfo;
exports.isLcMsGroup = void 0;
exports.splitAndReindexEntities = splitAndReindexEntities;
exports.useSplitAndReindexEntities = useSplitAndReindexEntities;
var _react = require("react");
function catToString(cat) {
  return Array.isArray(cat) ? String(cat[cat.length - 1] || '').toUpperCase() : String(cat || '').toUpperCase();
}
const collectCategories = entity => {
  const categories = [];
  if (Array.isArray(entity.features)) {
    entity.features.forEach(feature => {
      if (feature?.csCategory) categories.push(...[].concat(feature.csCategory));
    });
  }
  if (entity.feature?.csCategory) {
    categories.push(...[].concat(entity.feature.csCategory));
  }
  if (entity.csCategory) {
    categories.push(...[].concat(entity.csCategory));
  }
  return categories;
};
const getEntityValue = (entity, path, fallback = '') => {
  const parts = path.split('.');
  let current = entity;
  for (let i = 0; i < parts.length; i += 1) {
    if (!current) return fallback;
    current = current[parts[i]];
  }
  return current ?? fallback;
};
const normalizeUnit = value => String(value || '').toUpperCase().replace(/\s+/g, '');
const normalizeText = value => String(value || '').toUpperCase();
const parseNumeric = value => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const text = String(value || '').trim();
  if (!text) return null;
  const match = text.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
};
const firstSpectrum = entity => entity?.spectra?.[0] || entity?.feature || entity?.features?.[0] || null;
const getFirstTicX = entity => {
  const spectrum = firstSpectrum(entity);
  const x0 = spectrum?.data?.[0]?.x?.[0];
  return parseNumeric(x0);
};
const getMzPage = entity => {
  const spectrum = firstSpectrum(entity);
  return parseNumeric(spectrum?.pageValue ?? spectrum?.page ?? spectrum?.pageSymbol);
};
function getLcMsInfo(entity = {}) {
  if (entity.lcmsKind) {
    return {
      kind: entity.lcmsKind,
      polarity: entity.lcmsPolarity || 'neutral'
    };
  }
  const categories = collectCategories(entity);
  const normalizedCategories = categories.map(String).map(category => category.toUpperCase());
  const scanMode = normalizeText(entity.scanMode || entity.SCAN_MODE || entity.SCANMODE || getEntityValue(entity, 'info.SCAN_MODE') || getEntityValue(entity, 'info.SCANMODE') || getEntityValue(entity, 'spectra.0.scanMode') || getEntityValue(entity, 'spectra.0.SCAN_MODE') || getEntityValue(entity, 'spectra.0.SCANMODE') || getEntityValue(entity, 'feature.scanMode') || getEntityValue(entity, 'feature.SCAN_MODE') || getEntityValue(entity, 'feature.SCANMODE') || getEntityValue(entity, 'features.0.scanMode') || getEntityValue(entity, 'features.0.SCAN_MODE') || getEntityValue(entity, 'features.0.SCANMODE'));
  const hasNeg = normalizedCategories.some(category => category.includes('NEGATIVE') || category.startsWith('NEGATIV')) || scanMode.includes('NEGATIVE') || scanMode.includes('NEGATIV');
  const hasPos = normalizedCategories.some(category => category.includes('POSITIVE') || category.startsWith('POSITIV')) || scanMode.includes('POSITIVE') || scanMode.includes('POSITIV');
  let polarity = 'neutral';
  if (hasNeg) {
    polarity = 'negative';
  } else if (hasPos) {
    polarity = 'positive';
  }
  let kind = null;
  if (normalizedCategories.some(category => category.includes('TIC'))) kind = 'tic';
  if (!kind && normalizedCategories.some(category => category.includes('MZ'))) kind = 'mz';
  if (!kind && normalizedCategories.some(category => category.includes('UVVIS'))) kind = 'uvvis';
  const dataType = String(entity.dataType || entity.DATATYPE || getEntityValue(entity, 'info.DATATYPE') || getEntityValue(entity, 'spectra.0.dataType') || getEntityValue(entity, 'spectra.0.DATATYPE') || getEntityValue(entity, 'feature.dataType') || getEntityValue(entity, 'feature.DATATYPE') || getEntityValue(entity, 'features.0.dataType') || getEntityValue(entity, 'features.0.DATATYPE')).toUpperCase();
  const type = normalizeText(entity.type || entity.TYPE || getEntityValue(entity, 'info.TYPE') || getEntityValue(entity, 'spectra.0.type') || getEntityValue(entity, 'spectra.0.TYPE') || getEntityValue(entity, 'feature.type') || getEntityValue(entity, 'feature.TYPE') || getEntityValue(entity, 'features.0.type') || getEntityValue(entity, 'features.0.TYPE'));
  if (!kind && dataType.includes('MASS TIC')) kind = 'tic';
  if (!kind && dataType.includes('MASS SPECTRUM')) kind = 'mz';
  if (!kind && (dataType.includes('UV') || dataType.includes('UV-VIS'))) kind = 'uvvis';
  if (!kind && type.includes('CHROMATOGRAM')) kind = 'tic';
  if (!kind && type.includes('SPECTRUM') && dataType.includes('MASS')) kind = 'mz';
  const xUnit = normalizeUnit(entity.xUnit || getEntityValue(entity, 'spectra.0.xUnit') || getEntityValue(entity, 'feature.xUnit') || getEntityValue(entity, 'features.0.xUnit'));
  const yUnit = normalizeUnit(entity.yUnit || getEntityValue(entity, 'spectra.0.yUnit') || getEntityValue(entity, 'feature.yUnit') || getEntityValue(entity, 'features.0.yUnit'));
  if (!kind && xUnit.includes('M/Z')) kind = 'mz';
  if (!kind && (xUnit.includes('TIME') || xUnit.includes('MINUTE')) && (yUnit.includes('INTENSITY') || yUnit.includes('COUNT'))) {
    kind = 'tic';
  }
  return {
    kind: kind || 'unknown',
    polarity
  };
}
const alignMzPolarityWithTic = (ticEntities, mzEntities) => {
  const ticByPolarity = {};
  ticEntities.forEach(tic => {
    const info = getLcMsInfo(tic);
    const x = getFirstTicX(tic);
    if (info.polarity && x != null) ticByPolarity[info.polarity] = x;
  });
  const ticPolarityKeys = Object.keys(ticByPolarity);
  if (ticPolarityKeys.length < 2) return mzEntities;
  return mzEntities.map(mzEntity => {
    const mzPage = getMzPage(mzEntity);
    if (mzPage == null) return mzEntity;
    let nearestPolarity = null;
    let nearestDistance = Infinity;
    ticPolarityKeys.forEach(polarity => {
      const ticX = ticByPolarity[polarity];
      const distance = Math.abs(mzPage - ticX);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestPolarity = polarity;
      }
    });
    if (!nearestPolarity) return mzEntity;
    return {
      ...mzEntity,
      lcmsPolarity: nearestPolarity
    };
  });
};
function classify(entity) {
  const {
    kind,
    polarity
  } = getLcMsInfo(entity);
  if (kind === 'unknown') return 'unknown';
  return `${kind}_${polarity}`;
}
function splitAndReindexEntities(entities = []) {
  const tic = [];
  let mz = [];
  const uvvis = [];
  const unknown = [];
  const normalizedEntities = entities.map(entity => ({
    ...entity
  }));
  normalizedEntities.forEach(e => {
    const info = getLcMsInfo(e);
    e.lcmsKind = info.kind;
    e.lcmsPolarity = info.polarity;
    if (info.kind === 'tic') tic.push(e);else if (info.kind === 'mz') mz.push(e);else if (info.kind === 'uvvis') uvvis.push(e);else unknown.push(e);
  });
  mz = alignMzPolarityWithTic(tic, mz);
  const polarityRank = {
    positive: 0,
    negative: 1,
    neutral: 2
  };
  const byPolarity = (a, b) => {
    const aInfo = getLcMsInfo(a);
    const bInfo = getLcMsInfo(b);
    return (polarityRank[aInfo.polarity] ?? 99) - (polarityRank[bInfo.polarity] ?? 99);
  };
  tic.sort(byPolarity).forEach((e, i) => {
    e.curveIdx = i;
  });
  mz.sort(byPolarity).forEach((e, i) => {
    e.curveIdx = i;
  });
  return {
    ticEntities: tic,
    mzEntities: mz,
    uvvisEntities: uvvis,
    unknownEntities: unknown,
    dataEntities: [...mz, ...uvvis, ...unknown],
    allEntities: normalizedEntities
  };
}
function useSplitAndReindexEntities(entities = []) {
  return (0, _react.useMemo)(() => splitAndReindexEntities(entities), [entities]);
}
const isLcMsGroup = (entities = []) => {
  if (!entities || !Array.isArray(entities) || entities.length === 0) {
    return false;
  }
  const counts = {
    tic: 0,
    mz: 0,
    uvvis: 0
  };
  entities.forEach(e => {
    const {
      kind
    } = getLcMsInfo(e);
    if (counts[kind] !== undefined) counts[kind] += 1;
  });
  return counts.uvvis > 0 && (counts.tic > 0 || counts.mz > 0);
};
exports.isLcMsGroup = isLcMsGroup;
var _default = exports.default = splitAndReindexEntities;