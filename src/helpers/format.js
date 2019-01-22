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
    default:
      return 2;
  }
};

const fixDigit = (input, precision) => {
  const output = input || 0.0;
  return output.toFixed(precision);
};

const buildData = (target) => {
  if (!target) return { isExist: false };
  const sp = target && target.spectrum;
  const input = sp ? sp.data[0] : {};
  const xLabel = sp ? `X (${sp.xUnit})` : '';
  const yLabel = sp ? `Y (${sp.yUnit})` : '';
  const peakObjs = target && target.peakObjs;
  return {
    input, xLabel, yLabel, peakObjs, isExist: true,
  };
};

const toPeakStr = (peaks) => {
  const arr = peaks.map(p => `${p.x},${p.y}`);
  const str = arr.join('#');
  return str;
};

const spectraOps = {
  PLAIN: { head: '', tail: '.' },
  '1H': { head: '1H', tail: '.' },
  '13C': { head: '13C', tail: '.' },
  IR: { head: 'IR', tail: 'cm-1' },
};

const fixDigitAndRmRef = (input, precision, refValue) => {
  if (IsSame(input, refValue)) return null;
  return fixDigit(input, precision);
};

const peaksBody = (peaks, layout, shift, isAscend) => {
  const peaksXY = ToXY(peaks);
  const digit = spectraDigit(layout);
  const result = peaksXY.map(
    p => fixDigitAndRmRef(parseFloat(p[0]), digit, shift.ref.value),
  ).filter(r => r != null);

  const ascendFunc = (a, b) => a - b;
  const descendFunc = (a, b) => b - a;
  const sortFunc = isAscend ? ascendFunc : descendFunc;

  const ordered = result.sort(sortFunc).join(', ');
  return ordered;
};

const peaksWrapper = (layout, shift) => {
  let solvTxt = '';
  if (shift.ref.name !== '- - -') {
    solvTxt = ` (${shift.ref.name}) `;
  }

  if (layout === LIST_LAYOUT.PLAIN) {
    return { head: '', tail: '' };
  }

  const ops = spectraOps[layout];
  return { head: `${ops.head}${solvTxt}= `, tail: ops.tail };
};

const Format = {
  toPeakStr,
  buildData,
  spectraDigit,
  spectraOps,
  peaksBody,
  peaksWrapper,
};

export default Format;
