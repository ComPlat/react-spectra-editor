// Name of a curve as shown in the graph selection panel: the host-provided
// file name, else the spectrum title, else "Spectrum N".
const fallbackName = (entityFileNames, idx) => {
  if (entityFileNames && idx < entityFileNames.length) {
    return entityFileNames[idx];
  }
  return '';
};

const curveDisplayName = (spectra, idx, entityFileNames) => (
  fallbackName(entityFileNames, idx)
  || spectra?.title
  || spectra?.feature?.title
  || spectra?.spectrum?.title
  || `Spectrum ${idx + 1}`
);

export default curveDisplayName;
