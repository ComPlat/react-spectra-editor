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

const IsSame = (one, two) => Math.abs((one - two) * 10000000) < 1.0;

const pksRmNeg = (dataPks, editPeakSt) => {
  const { selectedIdx, peaks } = editPeakSt;
  const selectedEditPeaks = peaks[selectedIdx];
  if (!selectedEditPeaks) {
    return dataPks;
  }

  const { neg } = selectedEditPeaks;
  if (!neg) {
    return dataPks;
  }

  const negXs = neg.map(n => n.x);
  const result = dataPks.map((p) => {
    const idx = negXs.findIndex(nx => IsSame(nx, p.x));
    return idx >= 0 ? null : p;
  }).filter(r => r != null);
  return result;
};

const pksAddPos = (dataPks, editPeakSt) => {
  const { selectedIdx, peaks } = editPeakSt;
  const selectedEditPeaks = peaks[selectedIdx];
  if (!selectedEditPeaks) {
    return dataPks;
  }

  const { pos } = selectedEditPeaks;
  if (!pos) {
    return dataPks;
  }
  
  const posXs = pos.map(p => p.x);
  const posPks = dataPks.map((p) => {
    const idx = posXs.findIndex(px => px === p.x);
    return idx >= 0 ? null : p;
  }).filter(r => r != null);
  const result = [...posPks, ...pos];
  return result;
};

const PksEdit = (dataPks, editPeakSt, voltammetryPeak=false) => {
  if (voltammetryPeak && voltammetryPeak.length > 0) {
    let modDataPks = []
    voltammetryPeak.forEach(peak => {
      if (peak.max) {
        modDataPks = [...modDataPks, peak.max];
      }
      if (peak.min) {
        modDataPks = [...modDataPks, peak.min];
      }
    });
    modDataPks = modDataPks.sort((a, b) => a.x - b.x);
    return modDataPks;
  }
  else {
    let modDataPks = pksAddPos(dataPks, editPeakSt);
    modDataPks = pksRmNeg(modDataPks, editPeakSt);
    modDataPks = modDataPks.sort((a, b) => a.x - b.x);
    return modDataPks;
  }
};

const PeckersEdit = (voltammetryPeak) => {
  let modDataPeckers = []
  voltammetryPeak.forEach(peak => {
    if (peak.pecker) {
      modDataPeckers = [...modDataPeckers, peak.pecker];
    }
  });
  modDataPeckers = modDataPeckers.sort((a, b) => a.x - b.x);
  return modDataPeckers;
};

export {
  ToXY, PksEdit, IsSame, PeckersEdit
};
