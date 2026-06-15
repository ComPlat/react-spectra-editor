"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.snapRtToAxis = exports.readFiniteNumber = exports.pickFirstRtOnAxis = exports.pickFirstAvailablePolarity = exports.normalizeSpectrumId = exports.normalizeLcmsIntegrationsExport = exports.normalizeHintPolarity = void 0;
const normalizeSpectrumId = value => {
  if (value == null) return null;
  const numericValue = Number(value);
  if (Number.isFinite(numericValue)) return numericValue;
  return String(value);
};
exports.normalizeSpectrumId = normalizeSpectrumId;
const readFiniteNumber = v => {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
exports.readFiniteNumber = readFiniteNumber;
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
exports.normalizeHintPolarity = normalizeHintPolarity;
const pickFirstAvailablePolarity = (available, candidates) => {
  for (let i = 0; i < candidates.length; i += 1) {
    const p = candidates[i];
    if (p && available[p]) return p;
  }
  return null;
};
exports.pickFirstAvailablePolarity = pickFirstAvailablePolarity;
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

/** Align an RT (e.g. user click) onto the TIC axis after a data refresh. */
exports.pickFirstRtOnAxis = pickFirstRtOnAxis;
const snapRtToAxis = (rt, xs) => {
  if (!Number.isFinite(rt) || !Array.isArray(xs) || xs.length === 0) return null;
  const exact = xs.find(x => Math.abs(x - rt) < 1e-5);
  if (exact !== undefined) return exact;
  let best = xs[0];
  let bestD = Math.abs(xs[0] - rt);
  for (let i = 1; i < xs.length; i += 1) {
    const d = Math.abs(xs[i] - rt);
    if (d < bestD) {
      bestD = d;
      best = xs[i];
    }
  }
  return best;
};
exports.snapRtToAxis = snapRtToAxis;
const normalizeLcmsIntegrationsExport = value => ['percent', 'area', 'both'].includes(value) ? value : 'percent';
exports.normalizeLcmsIntegrationsExport = normalizeLcmsIntegrationsExport;