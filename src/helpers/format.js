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
  const refValue = shift.ref.value;
  return peaks.map(
    p => (IsSame(p.x, refValue) ? null : p),
  ).filter(r => r != null);
};

const fixDigitAndRmRef = (input, precision, refValue) => {
  if (IsSame(input, refValue)) return null;
  return fixDigit(input, precision);
};

const peaksBody = (peaks, layout, shift, isAscend) => {
  const peaksXY = ToXY(peaks);
  const digit = spectraDigit(layout);
  const result = peaksXY.map((p) => {
    const x = fixDigitAndRmRef(parseFloat(p[0]), digit, shift.ref.value);
    const y = parseFloat(p[1]);
    return { x, y };
  }).filter(r => r != null);

  const ascendFunc = (a, b) => a.x - b.x;
  const descendFunc = (a, b) => b.x - a.x;
  const sortFunc = isAscend ? ascendFunc : descendFunc;
  const ordered = result.sort(sortFunc);
  const maxY = Math.max(...ordered.map(o => o.y));

  if (layout !== LIST_LAYOUT.MS) {
    return ordered.map(o => o.x).join(', ');
  }
  return ordered.map(o => `${o.x}(${parseInt((100 * o.y / maxY), 10)}%)`)
    .join(', ');
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

const Format = {
  toPeakStr,
  buildData,
  spectraDigit,
  spectraOps,
  peaksBody,
  peaksWrapper,
  rmRef,
  isMs,
  isNmrLayout,
  isMsLayout,
  isIrLayout,
  fixDigit,
};

export default Format;
