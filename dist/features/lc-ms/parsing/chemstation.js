"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseChemstationPages = exports.isChemstationLcms = void 0;
var _lcmsMsPage = require("./lcmsMsPage");
var _lcmsCategory = require("./lcmsCategory");
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

// `\bTIC\b` rather than includes('TIC'), so STATIC / KINETIC / SYNTHETIC / OPTIC
// do not read as a total-ion chromatogram.
exports.parseChemstationPages = parseChemstationPages;
const TIC_TOKEN = /\bTIC\b/;

// A JCAMP label repeated across blocks arrives from jcampconverter as an array
// rather than a string, so every record read here is normalised to a list.
const upperList = value => [].concat(value == null ? [] : value).map(entry => String(entry).toUpperCase());
const upperTokens = value => upperList(value).reduce((acc, entry) => acc.concat(entry.split(/[,;]/)), []).map(token => token.trim()).filter(Boolean);
const isChemstationLcms = (source, jcamp) => {
  if (typeof source !== 'string') return false;
  const info = jcamp?.info || {};
  const spectra = Array.isArray(jcamp?.spectra) ? jcamp.spectra : [];
  // jcampconverter leaves the root `dataType` undefined and canonicalises
  // `##DATA TYPE` to info.DATATYPE, which may be an array on repeat.
  const dataTypes = upperList(jcamp?.dataType ?? info.DATATYPE);
  const spectrumDataTypes = spectra.map(s => String(s?.dataType || '').toUpperCase());
  const type = String(info.TYPE || '').toUpperCase();

  // 1. The file declares itself an LC/MS run or a total-ion chromatogram.
  if (dataTypes.some(d => d.includes('LC/MS') || d.includes('MASS TIC'))) return true;

  // 2. A block declares chromatogram content.
  if (spectrumDataTypes.some(d => TIC_TOKEN.test(d))) return true;
  if (type.includes('MS CHROMATOGRAM')) return true;
  const hasMassSpectrumRootDataType = dataTypes.some(d => d.includes('MASS SPECTRUM'));
  const scanMode = (0, _lcmsCategory.normalizeLcMsMode)(info.SCAN_MODE ?? info.SCANMODE);
  const software = String(info.SOFTWARE || '').toUpperCase();

  // 3. Structural discriminator. A Chemstation LC/MS export indexes its m/z scans
  //    by a retention-time PAGE variable (`##VAR_TYPE= PAGE, X, Y`); that page axis
  //    is what makes the file chromatographic. A plain chem-spectra MS NTUPLES
  //    export declares its time axis as a third INDEPENDENT variable
  //    (`##VAR_TYPE= INDEPENDENT, DEPENDENT, INDEPENDENT`, `##SYMBOL= X, Y, T`) and
  //    never declares a PAGE. Deciding on structure rather than on a units literal
  //    means writer-to-writer differences in spacing or vocabulary cannot flip it.
  //    Note `##VAR_TYPE` reaches us as info.VARTYPE - canonicDataLabels strips the
  //    underscore and uppercases - and `##NTUPLES` is not retained at all.
  const hasPageAxis = upperTokens(info.VARTYPE).includes('PAGE') || /##NTUPLES_PAGE_HEADER\s*=/.test(source);
  if (hasPageAxis) {
    // A PAGE axis alone is not conclusive - 2D NMR is page-indexed too - so the
    // page-indexed content still has to look like LC/MS.
    const categories = upperList(info.$CSCATEGORY);
    return hasMassSpectrumRootDataType || spectrumDataTypes.some(d => d.includes('MASS SPECTRUM')) || spectrumDataTypes.some(d => d.includes('HPLC UV-VIS') || d.includes('UVVIS')) || categories.some(c => TIC_TOKEN.test(c) || c.includes('UVVIS')) || categories.some(c => c.includes('POSITIVE') || c.includes('NEGATIVE') || c.includes('NEUTRAL')) || scanMode !== 'NEUTRAL' || software.includes('OPENLAB');
  }

  // 4. No page axis: fall back to vendor identity for the Chemstation exports that
  //    predate the page-indexed layout. Deliberately excludes a MASS SPECTRUM
  //    per-block dataType and `##TYPE= MS SPECTRUM` - a plain MS export carries
  //    both, and treating them as chromatographic evidence is what made a plain
  //    file render as LC/MS in the first place.
  return hasMassSpectrumRootDataType && (software.includes('OPENLAB') || scanMode !== 'NEUTRAL');
};
exports.isChemstationLcms = isChemstationLcms;