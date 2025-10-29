import { useMemo } from 'react';

export function catToString(cat) {
  return Array.isArray(cat)
    ? String(cat[cat.length - 1] || '').toUpperCase()
    : String(cat || '').toUpperCase();
}

export function classify(entity) {
  const cats = [];

  if (Array.isArray(entity.features)) {
    entity.features.forEach((f) => {
      if (f?.csCategory) cats.push(...[].concat(f.csCategory));
    });
  }
  if (entity.feature?.csCategory) {
    cats.push(...[].concat(entity.feature.csCategory));
  }

  const upper = cats.map(String).map((c) => c.toUpperCase());
  const isNeg = upper.some((c) => c.includes('NEGATIVE'));
  const isPos = upper.some((c) => c.includes('POSITIVE'));

  if (upper.some((c) => c.includes('TIC'))) {
    return isNeg ? 'tic_neg' : 'tic_pos';
  }
  if (upper.some((c) => c.includes('MZ'))) {
    return isNeg ? 'mz_neg' : 'mz_pos';
  }
  if (upper.some((c) => c.includes('UVVIS'))) return 'uvvis';

  if (entity.xUnit?.toLowerCase?.() === 'time' &&
      entity.yUnit?.toLowerCase?.() === 'intensity') {
    return isNeg ? 'tic_neg' : 'tic_pos';
  }
  return 'unknown';
}

export function splitAndReindexEntities(entities = []) {
  const tic = [];
  const mz  = [];
  const uvvis = [];
  const unknown = [];

  entities.forEach((e) => {
    const cat = catToString(e.feature?.csCategory || e.features?.[0]?.csCategory);
    if (cat.includes('TIC'))      tic.push(e);
    else if (cat.includes('MZ'))  mz.push(e);
    else if (cat.includes('UVVIS')) uvvis.push(e);
    else unknown.push(e);
  });

  const byPolarity = (a, b) => {
    const isNeg = (ent) => classify(ent).endsWith('_neg');
    return isNeg(a) - isNeg(b);
  };

  tic.sort(byPolarity).forEach((e, i) => (e.curveIdx = i));
  mz.sort(byPolarity).forEach((e, i)  => (e.curveIdx = i));

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

export default splitAndReindexEntities;
