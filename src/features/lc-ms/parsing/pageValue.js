/* eslint-disable import/prefer-default-export */
export const parseFeaturePageValue = (feature) => {
  const candidates = [feature?.pageValue, feature?.page, feature?.pageSymbol];
  for (let i = 0; i < candidates.length; i += 1) {
    const raw = candidates[i];
    if (raw != null) {
      if (typeof raw === 'number') {
        if (Number.isFinite(raw)) return raw;
      } else {
        const text = String(raw).split('\n')[0].trim();
        const match = text.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/);
        if (match) {
          const value = Number(match[0]);
          if (Number.isFinite(value)) return value;
        }
      }
    }
  }
  return null;
};
