const toXY = (peakObj) => {
  const length = peakObj.data && peakObj.data[0] ? peakObj.data[0].x.length : 0;
  if (length === 0) return [];
  const xs = peakObj.data[0].x;
  const ys = peakObj.data[0].y;
  let peaks = [];
  let i = 0;
  for (i = 0; i < length; i += 1) {
    const x = xs[i];
    const y = ys[i];
    peaks = [...peaks, [x, y]];
  }
  return peaks;
};

const pksRmNeg = (dataPks, editPeakSt) => {
  const { neg } = editPeakSt;
  const negXs = neg.map(n => n.x);
  const result = dataPks.map((p) => {
    const idx = negXs.findIndex(nx => nx === p.x);
    return idx >= 0 ? null : p;
  }).filter(r => r != null);
  return result;
};

const pksAddPos = (dataPks, editPeakSt) => {
  const { pos } = editPeakSt;
  const posXs = pos.map(p => p.x);
  const posPks = dataPks.map((p) => {
    const idx = posXs.findIndex(px => px === p.x);
    return idx >= 0 ? null : p;
  }).filter(r => r != null);
  const result = [...posPks, ...pos];
  return result;
};

export {
  toXY, pksRmNeg, pksAddPos,
};
