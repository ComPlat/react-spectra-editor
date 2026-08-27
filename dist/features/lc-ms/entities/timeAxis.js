"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reconcileLcMsTimeAxes = exports.maxTimeOf = exports.default = void 0;
var _extractEntityLCMS = require("./extractEntityLCMS");
const SECONDS_PER_MINUTE = 60;

// Every member of an LC/MS group describes one injection, so their retention-time axes
// must mean the same thing. A converter can get that wrong for a single file:
// chemotion-converter-app 1.9.3 emits the UV/VIS axis in seconds while labelling it
// `##XUNITS=MINUTES` (and the `##UNITS` X slot agrees), so nothing inside that file
// contradicts the label and no per-file heuristic can catch it - chem.js's own
// seconds-to-minutes pass is vetoed by the explicit MINUTES it declares.
//
// The sibling TIC is the independent evidence. Both cover the same run, so their spans
// should be comparable; a UV/VIS span some 60x its TIC's is a unit mismatch rather than a
// longer run. Observed: a UV/VIS of 0..599.825 "minutes" beside a TIC of 0.005..9.999,
// a ratio of 59.99, where the same instrument's healthy exports sit near 1 (19.96 vs
// 15.98 = 1.25). The window below is therefore far from any plausible true ratio.
const MIN_SECONDS_RATIO = 30;
const MAX_SECONDS_RATIO = 120;
const finite = value => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

// The largest x across a curve's blocks. Reads features and spectra alike, since an entity
// carries the same data under both and either may be the populated one.
const maxTimeOf = entity => {
  const blocks = [].concat(Array.isArray(entity?.features) ? entity.features : []).concat(Array.isArray(entity?.spectra) ? entity.spectra : []);
  let max = null;
  blocks.forEach(block => {
    const xs = block?.data?.[0]?.x;
    if (!Array.isArray(xs)) return;
    xs.forEach(value => {
      const num = finite(value);
      if (num !== null && (max === null || num > max)) max = num;
    });
  });
  return max;
};

// Scales every x-bearing field a curve carries. Mirrors the field list chem.js already
// scales when it converts at parse time (data blocks, peaks, integrations and the cached
// extrema), so a curve corrected here is indistinguishable from one that arrived correct.
exports.maxTimeOf = maxTimeOf;
const scaleBlock = (block, factor) => {
  if (!block) return block;
  const scale = value => {
    const num = finite(value);
    return num === null ? value : num * factor;
  };
  const next = {
    ...block
  };
  if (Array.isArray(block.data)) {
    next.data = block.data.map(d => Array.isArray(d?.x) ? {
      ...d,
      x: d.x.map(scale)
    } : d);
  }
  if (Array.isArray(block.peaks)) {
    next.peaks = block.peaks.map(p => ({
      ...p,
      x: scale(p.x)
    }));
  }
  if (Array.isArray(block.integrations)) {
    next.integrations = block.integrations.map(integ => ({
      ...integ,
      xL: scale(integ.xL),
      xU: scale(integ.xU),
      xExtent: integ.xExtent ? {
        ...integ.xExtent,
        xL: scale(integ.xExtent.xL),
        xU: scale(integ.xExtent.xU)
      } : integ.xExtent
    }));
  }
  if (block.maxX !== undefined) next.maxX = scale(block.maxX);
  if (block.minX !== undefined) next.minX = scale(block.minX);
  // The declared unit was the thing that was wrong; leave it agreeing with the data.
  if (typeof block.xUnit === 'string' && /SECOND|MINUTE|TIME/i.test(block.xUnit)) {
    next.xUnit = 'MINUTES';
  }
  return next;
};
const scaleEntityTime = (entity, factor) => {
  const next = {
    ...entity
  };
  if (Array.isArray(entity.features)) {
    next.features = entity.features.map(f => scaleBlock(f, factor));
  }
  if (Array.isArray(entity.spectra)) {
    next.spectra = entity.spectra.map(s => scaleBlock(s, factor));
  }
  return next;
};

/**
 * Reconciles the retention-time axes of an LC/MS group against each other, correcting a
 * UV/VIS trace that arrived in seconds behind a MINUTES label.
 *
 * Deliberately one-directional: only the UV/VIS is adjusted, and only against a TIC. A TIC
 * that is itself in seconds is chem.js's job, at parse time, where the file's own units
 * still say so. Returns the input untouched when there is nothing to reconcile, so callers
 * can apply it unconditionally.
 */
const reconcileLcMsTimeAxes = (entities = []) => {
  if (!Array.isArray(entities) || entities.length < 2) return entities;
  const kinds = entities.map(e => (0, _extractEntityLCMS.getLcMsInfo)(e).kind);
  const ticMax = entities.filter((_, i) => kinds[i] === 'tic').map(maxTimeOf).filter(v => v !== null && v > 0).reduce((acc, v) => acc === null || v > acc ? v : acc, null);
  if (ticMax === null) return entities;
  let changed = false;
  const next = entities.map((entity, i) => {
    if (kinds[i] !== 'uvvis') return entity;
    const uvvisMax = maxTimeOf(entity);
    if (uvvisMax === null || uvvisMax <= 0) return entity;
    const ratio = uvvisMax / ticMax;
    if (ratio < MIN_SECONDS_RATIO || ratio > MAX_SECONDS_RATIO) return entity;
    changed = true;
    return scaleEntityTime(entity, 1 / SECONDS_PER_MINUTE);
  });
  return changed ? next : entities;
};
exports.reconcileLcMsTimeAxes = reconcileLcMsTimeAxes;
var _default = exports.default = reconcileLcMsTimeAxes;