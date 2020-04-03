const calcMpyJ1 = (k, metaSt) => {
  const { observeFrequency } = metaSt.peaks;
  const freq = observeFrequency || 1.0;

  const { peaks } = k;
  const pxs = peaks.map(p => p.x).sort((a, b) => b - a);
  const dxs = pxs.map((x, idx, arr) => idx > 0 && arr[idx - 1] - arr[idx]);
  const intervals = (dxs.length - 1) || 1;
  const j1 = freq * dxs.reduce((sum, x) => sum + x) / intervals;
  return [j1];
};

export {
  calcMpyJ1,
};
