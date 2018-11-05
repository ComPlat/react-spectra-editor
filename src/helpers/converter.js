const ToXY = (data) => {
  const length = data ? data.length : 0;
  if (length === 0) return [];
  let peaks = [];
  let i = 0;
  for (i = 0; i < length; i += 1) {
    const { x, y } = data[i];
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

const PksEdit = (dataPks, editPeakSt) => {
  let modDataPks = pksAddPos(dataPks, editPeakSt);
  modDataPks = pksRmNeg(modDataPks, editPeakSt);
  return modDataPks;
};

export {
  ToXY, PksEdit,
};
