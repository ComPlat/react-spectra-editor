"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatLcmsIntegralsForBackend = formatLcmsIntegralsForBackend;
exports.formatLcmsPeaksForBackend = formatLcmsPeaksForBackend;
exports.getLcmsMzPageData = getLcmsMzPageData;
function formatLcmsPeaksForBackend(hplcMsSt) {
  const allPeaks = [];
  if (hplcMsSt && hplcMsSt.uvvis && hplcMsSt.uvvis.spectraList) {
    hplcMsSt.uvvis.spectraList.forEach(spectrum => {
      if (spectrum.peaks && spectrum.peaks.length > 0) {
        const {
          pageValue
        } = spectrum;
        spectrum.peaks.forEach(peak => {
          allPeaks.push({
            ...peak,
            wavelength: pageValue
          });
        });
      }
    });
  }
  return allPeaks;
}
function formatLcmsIntegralsForBackend(hplcMsSt) {
  const allIntegrals = [];
  if (hplcMsSt && hplcMsSt.uvvis && hplcMsSt.uvvis.spectraList) {
    hplcMsSt.uvvis.spectraList.forEach(spectrum => {
      if (spectrum.integrations && spectrum.integrations.length > 0) {
        const {
          pageValue
        } = spectrum;
        spectrum.integrations.forEach(integral => {
          allIntegrals.push({
            from: integral.xL,
            to: integral.xU,
            value: integral.area,
            integral: integral.absoluteArea,
            wavelength: pageValue
          });
        });
      }
    });
  }
  return allIntegrals;
}
function getLcmsMzPageData(hplcMsSt) {
  const tic = hplcMsSt?.tic;
  const ms = hplcMsSt?.ms;
  if (!tic || !ms) return null;
  const polarity = tic.polarity || 'positive';
  let polarityKey = 'neutral';
  if (polarity === 'negative') polarityKey = 'negative';else if (polarity === 'positive') polarityKey = 'positive';
  const ticDataX = tic[polarityKey]?.data?.x;
  if (!Array.isArray(ticDataX) || !Number.isFinite(tic.currentPageValue)) return null;
  let currentIndex = ms[polarityKey]?.pageValues?.findIndex(value => Number.isFinite(value) && Math.abs(value - tic.currentPageValue) < 1e-6);
  if (!Number.isFinite(currentIndex) || currentIndex < 0) {
    currentIndex = ticDataX.findIndex(x => Math.abs(x - tic.currentPageValue) < 1e-6);
  }
  if (currentIndex < 0) return null;
  const peaks = ms[polarityKey]?.peaks?.[currentIndex];
  return Array.isArray(peaks) ? peaks : null;
}