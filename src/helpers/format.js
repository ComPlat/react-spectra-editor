import { ToXY, IsSame } from './converter';
import { LIST_LAYOUT } from '../constants/list_layout';

const spectraDigit = (layout) => {
  switch (layout) {
    case LIST_LAYOUT.C13:
      return 1;
    case LIST_LAYOUT.IR:
      return 0;
    case LIST_LAYOUT.H1:
    case LIST_LAYOUT.PLAIN:
    case LIST_LAYOUT.MS:
    default:
      return 2;
  }
};

const opToLayout = (operation) => {
  const { nucleus, typ } = operation;
  switch (typ + nucleus) {
    case 'INFRARED':
      return LIST_LAYOUT.IR;
    case 'NMR1H':
      return LIST_LAYOUT.H1;
    case 'NMR13C':
      return LIST_LAYOUT.C13;
    case 'MS':
      return LIST_LAYOUT.MS;
    case 'NMR19F':
    default:
      return LIST_LAYOUT.PLAIN;
  }
};

const fixDigit = (input, precision) => {
  const output = input || 0.0;
  return output.toFixed(precision);
};

const buildData = (entity) => {
  if (!entity) return { isExist: false };
  const sp = entity && entity.spectrum;
  const xLabel = sp ? `X (${sp.xUnit})` : '';
  const yLabel = sp ? `Y (${sp.yUnit})` : '';
  return {
    entity, xLabel, yLabel, isExist: true,
  };
};

const toPeakStr = (peaks) => {
  const arr = peaks.map(p => `${p.x},${p.y}`);
  const str = arr.join('#');
  return str;
};

const spectraOps = {
  [LIST_LAYOUT.PLAIN]: { head: '', tail: '.' },
  [LIST_LAYOUT.H1]: { head: '1H', tail: '.' },
  [LIST_LAYOUT.C13]: { head: '13C', tail: '.' },
  [LIST_LAYOUT.IR]: { head: 'IR', tail: 'cm-1' },
  [LIST_LAYOUT.MS]: { head: 'MASS', tail: 'm/z' },
};

const rmRef = (peaks, shift) => {
  const refValue = shift.ref.value || shift.peak.x;
  return peaks.map(
    p => (IsSame(p.x, refValue) ? null : p),
  ).filter(r => r != null);
};

const formatedMS = (peaks, maxY, decimal = 2, isAscend = true) => {
  const ascendFunc = (a, b) => parseFloat(a) - parseFloat(b);
  const descendFunc = (a, b) => parseFloat(b) - parseFloat(a);
  const sortFunc = isAscend ? ascendFunc : descendFunc;
  let ordered = {};

  peaks.forEach((p) => {
    const x = fixDigit(p.x, decimal);
    const better = !ordered[x] || (p.y > ordered[x]);
    if (better) {
      ordered = Object.assign({}, ordered, { [x]: p.y });
    }
  });

  ordered = Object.keys(ordered).sort(sortFunc)
    .map(k => ({ x: k, y: ordered[k] }));

  return ordered.map(o => `${o.x}(${parseInt((100 * o.y / maxY), 10)}%)`)
    .join(', ');
};

const rmShiftFromPeaks = (peaks, shift) => {
  const peaksXY = ToXY(peaks);
  // const digit = spectraDigit(layout);
  const rmShiftX = shift.ref.value || shift.peak.x;
  const result = peaksXY.map((p) => {
    const srcX = parseFloat(p[0]);
    const x = IsSame(srcX, rmShiftX) ? null : srcX;
    if (!x) return null;
    const y = parseFloat(p[1]);
    return { x, y };
  }).filter(r => r != null);
  return result;
};

const peaksBody = (peaks, layout, decimal, shift, isAscend) => {
  const result = rmShiftFromPeaks(peaks, shift);

  const ascendFunc = (a, b) => a.x - b.x;
  const descendFunc = (a, b) => b.x - a.x;
  const sortFunc = isAscend ? ascendFunc : descendFunc;
  const ordered = result.sort(sortFunc);
  const maxY = Math.max(...ordered.map(o => o.y));

  if (layout === LIST_LAYOUT.MS) {
    return formatedMS(ordered, maxY, decimal, isAscend);
  }
  return ordered.map(o => fixDigit(o.x, decimal)).join(', ');
};

const peaksWrapper = (layout, shift) => {
  let solvTxt = '';
  if (shift.ref.label) {
    solvTxt = ` (${shift.ref.label}) `;
  }

  if (layout === LIST_LAYOUT.PLAIN) {
    return { head: '', tail: '' };
  }

  const ops = spectraOps[layout];
  return { head: `${ops.head}${solvTxt}= `, tail: ops.tail };
};

const isMs = po => po.operation.typ === LIST_LAYOUT.MS;

const isNmrLayout = layoutSt => (
  [LIST_LAYOUT.H1, LIST_LAYOUT.C13].indexOf(layoutSt) >= 0
);
const isMsLayout = layoutSt => [LIST_LAYOUT.MS].indexOf(layoutSt) >= 0;
const isIrLayout = layoutSt => [LIST_LAYOUT.IR].indexOf(layoutSt) >= 0;

const formatPeaksByPrediction = (
  peaks, layout, isAscend, decimal, predictions = [],
) => {
  const pDict = {};
  peaks.forEach((p) => {
    pDict[p.x.toFixed(decimal)] = 0;
  });

  predictions.forEach((p) => {
    const key = p.real.toFixed(decimal);
    if (typeof pDict[key] === 'number') {
      pDict[key] += 1;
    }
  });

  const typ = layout === '13C' ? 'C' : 'H';

  const ascendFunc = (a, b) => a.k - b.k;
  const descendFunc = (a, b) => b.k - a.k;
  const sortFunc = isAscend ? ascendFunc : descendFunc;
  const pArr = Object.keys(pDict).map((k) => {
    if (pDict[k] === 1) return { k, v: k };
    return { k, v: `${k}(${pDict[k]}${typ})` };
  }).sort(sortFunc);

  const body = pArr.map(p => p.v).join(', ');
  return body;
};

const Format = {
  toPeakStr,
  buildData,
  spectraDigit,
  spectraOps,
  peaksBody,
  peaksWrapper,
  rmRef,
  rmShiftFromPeaks,
  isMs,
  isNmrLayout,
  isMsLayout,
  isIrLayout,
  fixDigit,
  opToLayout,
  formatPeaksByPrediction,
  formatedMS,
};

export default Format;
