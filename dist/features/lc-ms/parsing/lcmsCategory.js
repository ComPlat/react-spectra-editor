"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeLcMsMode = exports.inferLcMsKind = exports.inferLcMsCategory = void 0;
const normalizeLcMsMode = value => {
  const mode = String(value || '').toUpperCase();
  if (!mode) return 'NEUTRAL';
  if (mode.includes('NEGATIVE') || mode.includes('NEGATIV')) return 'NEGATIVE';
  if (mode.includes('POSITIVE') || mode.includes('POSITIV')) return 'POSITIVE';
  if (mode.includes('NEUTRAL')) return 'NEUTRAL';
  return 'NEUTRAL';
};
exports.normalizeLcMsMode = normalizeLcMsMode;
const inferLcMsKind = (spectrum, jcamp) => {
  const spectrumDataType = String(spectrum?.dataType || '').toUpperCase();
  const jcampDataType = String(jcamp?.dataType || '').toUpperCase();
  const type = String(jcamp?.info?.TYPE || '').toUpperCase();
  const xUnit = String(spectrum?.xUnit || jcamp?.info?.XUNITS || jcamp?.xUnit || '').toUpperCase();
  const yUnit = String(spectrum?.yUnit || jcamp?.info?.YUNITS || jcamp?.yUnit || '').toUpperCase();
  if (spectrumDataType.includes('MASS TIC') || jcampDataType.includes('MASS TIC') || type.includes('CHROMATOGRAM')) {
    return 'TIC';
  }
  if (spectrumDataType.includes('MASS SPECTRUM') || jcampDataType.includes('MASS SPECTRUM')) {
    return 'MZ';
  }
  if (xUnit.includes('TIME') || xUnit.includes('MINUTE')) {
    if (yUnit.includes('INTENSITY') || yUnit.includes('COUNT')) return 'TIC';
  }
  if (xUnit.includes('M/Z') || xUnit.includes('MZ')) return 'MZ';
  return 'SPECTRUM';
};
exports.inferLcMsKind = inferLcMsKind;
const inferLcMsCategory = (spectrum, jcamp) => {
  const existing = spectrum?.csCategory;
  if (existing) return existing;
  const category = inferLcMsKind(spectrum, jcamp);
  const mode = normalizeLcMsMode(jcamp?.info?.SCAN_MODE || jcamp?.info?.SCANMODE);
  if (category === 'UVVIS') return 'UVVIS PEAK TABLE';
  if (category === 'TIC' || category === 'MZ') return `${category} ${mode} SPECTRUM`;
  return `${category} SPECTRUM`;
};
exports.inferLcMsCategory = inferLcMsCategory;