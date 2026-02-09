import { useMemo } from 'react';

export function catToString(cat) {
  return Array.isArray(cat)
    ? String(cat[cat.length - 1] || '').toUpperCase()
    : String(cat || '').toUpperCase();
}

const collectCategories = (entity) => {
  const cats = [];
  if (Array.isArray(entity.features)) {
    entity.features.forEach((f) => {
      if (f?.csCategory) cats.push(...[].concat(f.csCategory));
    });
  }
  if (entity.feature?.csCategory) {
    cats.push(...[].concat(entity.feature.csCategory));
  }
  if (entity.csCategory) {
    cats.push(...[].concat(entity.csCategory));
  }
  return cats;
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

const normalizeUnit = (value) => String(value || '').toUpperCase().replace(/\s+/g, '');

export function getLcMsInfo(entity = {}) {
  if (entity.lcmsKind) {
    return {
      kind: entity.lcmsKind,
      polarity: entity.lcmsPolarity || 'neutral',
    };
  }

  const cats = collectCategories(entity);
  const upperCats = cats.map(String).map((c) => c.toUpperCase());
  const hasNeg = upperCats.some((c) => c.includes('NEGATIVE'));
  const hasPos = upperCats.some((c) => c.includes('POSITIVE'));
  let polarity = 'neutral';
  if (hasNeg) {
    polarity = 'negative';
  } else if (hasPos) {
    polarity = 'positive';
  }

  let kind = null;
  if (upperCats.some((c) => c.includes('TIC'))) kind = 'tic';
  if (!kind && upperCats.some((c) => c.includes('MZ'))) kind = 'mz';
  if (!kind && upperCats.some((c) => c.includes('UVVIS'))) kind = 'uvvis';

  const dataType = String(
    entity.dataType
    || getEntityValue(entity, 'spectra.0.dataType')
    || getEntityValue(entity, 'feature.dataType')
    || getEntityValue(entity, 'features.0.dataType'),
  ).toUpperCase();
  if (!kind && dataType.includes('MASS TIC')) kind = 'tic';
  if (!kind && dataType.includes('MASS SPECTRUM')) kind = 'mz';
  if (!kind && (dataType.includes('UV') || dataType.includes('UV-VIS'))) kind = 'uvvis';

  const xUnit = normalizeUnit(
    entity.xUnit
    || getEntityValue(entity, 'spectra.0.xUnit')
    || getEntityValue(entity, 'feature.xUnit')
    || getEntityValue(entity, 'features.0.xUnit'),
  );
  const yUnit = normalizeUnit(
    entity.yUnit
    || getEntityValue(entity, 'spectra.0.yUnit')
    || getEntityValue(entity, 'feature.yUnit')
    || getEntityValue(entity, 'features.0.yUnit'),
  );
  if (!kind && xUnit.includes('M/Z')) kind = 'mz';
  if (!kind && (xUnit.includes('TIME') || xUnit.includes('MINUTE')) && yUnit.includes('INTENSITY')) {
    kind = 'tic';
  }

  return { kind: kind || 'unknown', polarity };
}

export function classify(entity) {
  const { kind, polarity } = getLcMsInfo(entity);
  if (kind === 'unknown') return 'unknown';
  return `${kind}_${polarity}`;
}

export function splitAndReindexEntities(entities = []) {
  const tic = [];
  const mz = [];
  const uvvis = [];
  const unknown = [];

  entities.forEach((e) => {
    const info = getLcMsInfo(e);
    e.lcmsKind = info.kind;
    e.lcmsPolarity = info.polarity;
    if (info.kind === 'tic') tic.push(e);
    else if (info.kind === 'mz') mz.push(e);
    else if (info.kind === 'uvvis') uvvis.push(e);
    else unknown.push(e);
  });

  const polarityRank = { positive: 0, negative: 1, neutral: 2 };
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
    allEntities: entities,
  };
}

export function useSplitAndReindexEntities(entities = []) {
  return useMemo(() => splitAndReindexEntities(entities), [entities]);
}

export const isLcMsGroup = (entities = []) => {
  if (!entities || !Array.isArray(entities) || entities.length === 0) {
    return false;
  }
  const counts = { tic: 0, mz: 0, uvvis: 0 };
  entities.forEach((e) => {
    const { kind } = getLcMsInfo(e);
    if (counts[kind] !== undefined) counts[kind] += 1;
  });
  return counts.uvvis > 0 && (counts.tic > 0 || counts.mz > 0);
};

export default splitAndReindexEntities;
