// Normalization for the multi-spectra comparison view: every curve is scaled
// so that its highest peak matches the highest peak of the reference curve.
// The y axis then shows percent of that peak height.

const maxY = (data) => {
  if (!Array.isArray(data) || data.length === 0) return null;
  let max = -Infinity;
  data.forEach((d) => {
    if (d && Number.isFinite(d.y) && d.y > max) max = d.y;
  });
  return Number.isFinite(max) ? max : null;
};

const scaleToReference = (data, refMax) => {
  const curMax = maxY(data);
  if (!(refMax > 0) || !(curMax > 0)) return data;
  const factor = refMax / curMax;
  return data.map((d) => ({ ...d, y: d.y * factor }));
};

const toPercent = (y, refMax) => (refMax > 0 ? (y / refMax) * 100 : y);

export { maxY, scaleToReference, toPercent };
