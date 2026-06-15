"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseChemstationPages = exports.isChemstationLcms = void 0;
var _lcmsMsPage = require("./lcmsMsPage");
const parseChemstationPages = (source, jcamp) => {
  if (typeof source !== 'string') return [];
  const parts = source.split(/##PAGE=/);
  if (parts.length <= 1) return [];
  const info = jcamp?.info || {};
  const baseSpectrum = Array.isArray(jcamp?.spectra) ? jcamp.spectra[0] : null;
  const dataType = baseSpectrum?.dataType || jcamp?.dataType || 'LC/MS';
  const xUnit = info.XUNITS || baseSpectrum?.xUnit || jcamp?.xUnit || '';
  const yUnit = info.YUNITS || baseSpectrum?.yUnit || jcamp?.yUnit || '';
  const spectra = [];
  for (let i = 1; i < parts.length; i += 1) {
    const block = parts[i];
    const lines = block.split(/\r?\n/);
    const pageLine = (lines[0] || '').trim();
    const pageValue = (0, _lcmsMsPage.parsePageValue)(pageLine);
    const dataStart = lines.findIndex(line => line.startsWith('##DATA TABLE') || line.startsWith('##XYDATA'));
    if (dataStart >= 0) {
      const x = [];
      const y = [];
      for (let j = dataStart + 1; j < lines.length; j += 1) {
        const rawLine = lines[j].trim();
        if (rawLine) {
          if (rawLine.startsWith('##')) break;
          const partsLine = rawLine.split(/[,\s]+/).filter(Boolean);
          if (partsLine.length >= 2) {
            const xVal = Number(partsLine[0]);
            const yVal = Number(partsLine[1]);
            if (Number.isFinite(xVal) && Number.isFinite(yVal)) {
              x.push(xVal);
              y.push(yVal);
            }
          }
        }
      }
      if (x.length > 0) {
        const pageSymbol = pageLine || pageValue;
        spectra.push({
          dataType,
          xUnit,
          yUnit,
          pageValue,
          page: pageLine || pageValue,
          pageSymbol,
          data: [{
            x,
            y
          }]
        });
      }
    }
  }
  return spectra;
};
exports.parseChemstationPages = parseChemstationPages;
const isChemstationLcms = (source, jcamp) => {
  if (typeof source !== 'string') return false;
  const dt = String(jcamp?.dataType || jcamp?.info?.DATATYPE || '').toUpperCase();
  if (dt.includes('LC/MS') || dt.includes('MASS TIC')) return true;
  const spectra = Array.isArray(jcamp?.spectra) ? jcamp.spectra : [];
  const info = jcamp?.info || {};
  const scanMode = String(info.SCAN_MODE || info.SCANMODE || '').toUpperCase();
  const type = String(info.TYPE || '').toUpperCase();
  const software = String(info.SOFTWARE || '').toUpperCase();
  const csCategory = jcamp?.info?.$CSCATEGORY;
  const categories = Array.isArray(csCategory) ? csCategory.map(c => String(c).toUpperCase()) : [];
  const hasPolarityCategory = categories.some(c => c.includes('POSITIVE') || c.includes('NEGATIVE') || c.includes('NEUTRAL'));
  const hasTicOrUvvisCategory = categories.some(c => c.includes('TIC') || c.includes('UVVIS'));
  const hasHplcUvvisSpectrumDataType = spectra.some(s => {
    const sdt = String(s?.dataType || '').toUpperCase();
    return sdt.includes('HPLC UV-VIS') || sdt.includes('UVVIS');
  });
  const hasMassTicSpectrumDataType = spectra.some(s => {
    const sdt = String(s?.dataType || '').toUpperCase();
    return sdt.includes('MASS TIC') || sdt.includes('TIC');
  });
  const hasMassSpectrumDataType = spectra.some(s => {
    const sdt = String(s?.dataType || '').toUpperCase();
    return sdt.includes('MASS SPECTRUM');
  });
  const hasMassSpectrumRootDataType = dt.includes('MASS SPECTRUM');
  const hasScanModeHint = scanMode.includes('POSITIVE') || scanMode.includes('NEGATIVE') || scanMode.includes('POSITIV') || scanMode.includes('NEGATIV');
  const hasTypeHint = type.includes('MS SPECTRUM') || type.includes('MS CHROMATOGRAM');
  const hasSoftwareHint = software.includes('OPENLAB');
  const hasMultipleSpectra = spectra.length > 1;
  const hasPageMetadata = spectra.some(s => s?.page != null || s?.pageValue != null);
  const hasNtuplesPageHeader = /##NTUPLES_PAGE_HEADER\s*=/.test(source);
  if (hasNtuplesPageHeader && (hasTicOrUvvisCategory || hasHplcUvvisSpectrumDataType || hasMassTicSpectrumDataType || hasMassSpectrumDataType && hasPolarityCategory)) {
    return true;
  }
  if (hasMultipleSpectra && hasPageMetadata && (hasTicOrUvvisCategory || hasHplcUvvisSpectrumDataType || hasMassTicSpectrumDataType || hasMassSpectrumDataType && hasPolarityCategory)) {
    return true;
  }
  if (hasMassSpectrumRootDataType && (hasMassSpectrumDataType || hasScanModeHint || hasTypeHint || hasSoftwareHint)) {
    return true;
  }
  if (hasMassTicSpectrumDataType && (hasTypeHint || hasSoftwareHint || hasScanModeHint || spectra.length > 0)) {
    return true;
  }
  return false;
};
exports.isChemstationLcms = isChemstationLcms;