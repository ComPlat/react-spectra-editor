import JAnalyzer from '../third_party/jAnalyzer';

const centerX = (ps, shift) => {
  const pxs = ps.map(p => p.x).sort((a, b) => a - b);
  const centIdx = (ps.length - 1) / 2;
  if (centIdx < 0) return 0;
  return pxs[centIdx] - shift;
};

const calcMpyCenter = (ps, shift, typ) => {
  const count = ps.length;
  const avgX = ps.reduce((sum, nxt) => sum + nxt.x, 0) / ps.length - shift;
  if (typ === 'm') return avgX;
  if (count % 2 === 0) return avgX;
  return centerX(ps, shift);
};

const calcJStr = (js) => {
  if (!Array.isArray(js) || js.length === 0) return ' - ';
  const cJ = js.map(j => j.toFixed(3)).join(', ');
  return `${cJ}`;
};

const calcArea = (d, refArea, refFactor) => (
  (d.area * refFactor / refArea).toFixed(2)
);

const calcPeakWidth = (x, metaSt) => {
  const { intervalL, intervalR, deltaX } = metaSt.peaks;
  let idxL = null;
  intervalL.every((l, idx) => {
    if (l.x < x) {
      idxL = idx - 1;
      return false;
    }
    return true;
  });
  let idxR = null;
  intervalR.every((l, idx) => {
    if (l.x < x) {
      idxR = idx;
      return false;
    }
    return true;
  });
  if (!idxL || !idxR) return 10 * deltaX;
  return Math.abs(intervalL[idxL].x - intervalR[idxR].x);
};

const calcMpyCoup = (pks, metaSt) => {
  if (pks.length === 0) return { type: '', js: '' };
  const sortPks = pks.sort((a, b) => b.x - a.x);
  const { observeFrequency } = metaSt.peaks;
  const peaks = sortPks.map(p => (
    {
      x: p.x,
      intensity: p.y,
      width: calcPeakWidth(p.x, metaSt),
    }
  ));

  const signal = {
    nbPeaks: peaks.length,
    observe: observeFrequency,
    nucleus: '1H',
    peaks,
  };
  JAnalyzer.compilePattern(signal);
  const type = signal.multiplicity;
  const js = signal.nmrJs ? signal.nmrJs.map(j => j.coupling).sort() : [];
  const isWrong = (type === 's' && peaks.length > 1)
    || (type === 'd' && peaks.length > 2)
    || (type === 't' && peaks.length > 3)
    || (type === 'q' && peaks.length > 4)
    || (type === 'quint' && peaks.length > 5)
    || (type === 'h' && peaks.length > 6)
    || (type === 'sept' && peaks.length > 7)
    || (type === 'o' && peaks.length > 8)
    || (type === 'n' && peaks.length > 9);
  if (isWrong) {
    return { type: 'm', js: [] };
  }
  return { type, js };
};

export {
  calcMpyCenter, calcArea, calcJStr, calcMpyCoup,
};
