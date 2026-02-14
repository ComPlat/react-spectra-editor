"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToXY = exports.PksEdit = exports.PeckersEdit = exports.IsSame = void 0;
const ToXY = data => {
  const length = data ? data.length : 0;
  if (length === 0) return [];
  let peaks = [];
  let i = 0;
  for (i = 0; i < length; i += 1) {
    const {
      x,
      y
    } = data[i];
    peaks = [...peaks, [x, y]];
  }
  return peaks;
};
exports.ToXY = ToXY;
const IsSame = (one, two) => Math.abs((one - two) * 10000000) < 1.0;
exports.IsSame = IsSame;
const pksRmNeg = (dataPks, editPeakSt) => {
  const {
    selectedIdx,
    peaks
  } = editPeakSt;
  const selectedEditPeaks = peaks[selectedIdx];
  if (!selectedEditPeaks) {
    return dataPks;
  }
  const {
    neg
  } = selectedEditPeaks;
  if (!neg) {
    return dataPks;
  }
  const negXs = neg.map(n => n.x);
  const result = dataPks.map(p => {
    const idx = negXs.findIndex(nx => IsSame(nx, p.x));
    return idx >= 0 ? null : p;
  }).filter(r => r != null);
  return result;
};
const pksAddPos = (dataPks, editPeakSt) => {
  const {
    selectedIdx,
    peaks
  } = editPeakSt;
  const selectedEditPeaks = peaks[selectedIdx];
  if (!selectedEditPeaks) {
    return dataPks;
  }
  const {
    pos
  } = selectedEditPeaks;
  if (!pos) {
    return dataPks;
  }
  const posXs = pos.map(p => p.x);
  const posPks = dataPks.map(p => {
    const idx = posXs.findIndex(px => px === p.x);
    return idx >= 0 ? null : p;
  }).filter(r => r != null);
  const result = [...posPks, ...pos];
  return result;
};
const PksEdit = exports.PksEdit = function PksEdit(dataPks, editPeakSt) {
  let voltammetryPeak = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  if (voltammetryPeak && voltammetryPeak.length > 0) {
    let modDataPks = [];
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
  let modDataPks = pksAddPos(dataPks, editPeakSt);
  modDataPks = pksRmNeg(modDataPks, editPeakSt);
  modDataPks = modDataPks.sort((a, b) => a.x - b.x);
  return modDataPks;
};
const PeckersEdit = voltammetryPeak => {
  let modDataPeckers = [];
  voltammetryPeak.forEach(peak => {
    if (peak.pecker) {
      modDataPeckers = [...modDataPeckers, peak.pecker];
    }
  });
  modDataPeckers = modDataPeckers.sort((a, b) => a.x - b.x);
  return modDataPeckers;
};
exports.PeckersEdit = PeckersEdit;