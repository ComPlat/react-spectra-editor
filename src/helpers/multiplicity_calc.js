import JAnalyzer from '../third_party/jAnalyzer';
import { getInterval } from './multiplicity';
import {
  verifyTypeT, verifyTypeQ, verifyTypeQuint, verifyTypeH,
  verifyTypeSept, verifyTypeO,
  verifyTypePeakCount,
} from './multiplicity_verify_basic';

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

const calcMpyJStr = (js) => {
  if (!Array.isArray(js) || js.length === 0) return ' - ';
  const cJ = js.map(j => j.toFixed(3)).join(', ');
  return `${cJ}`;
};

const calcMpyPeakWidth = (x, metaSt) => {
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
  const orderPks = pks.sort((a, b) => b.x - a.x);
  const { observeFrequency } = metaSt.peaks;
  const peaks = orderPks.map(p => (
    {
      x: p.x,
      intensity: p.y,
      width: calcMpyPeakWidth(p.x, metaSt),
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

  const isTPCMatch = verifyTypePeakCount(type, peaks);
  if (!isTPCMatch) return { type: 'm', js: [] };

  if (['s', 'm'].indexOf(type) >= 0) return { type, js };

  const oivs = getInterval(orderPks);
  if (type === 't') return verifyTypeT(type, js, oivs, metaSt);
  if (type === 'q') return verifyTypeQ(type, js, oivs, metaSt);
  if (type === 'quint') return verifyTypeQuint(type, js, oivs, metaSt);
  if (type === 'h') return verifyTypeH(type, js, oivs, metaSt);
  if (type === 'sept') return verifyTypeSept(type, js, oivs, metaSt);
  if (type === 'o') return verifyTypeO(type, js, oivs, metaSt);
  return { type, js };
};

export {
  calcMpyCenter, calcMpyJStr, calcMpyCoup,
};
