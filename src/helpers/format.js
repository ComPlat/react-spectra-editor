/* eslint-disable no-mixed-operators, prefer-object-spread,
function-paren-newline, no-unused-vars, default-param-last */
import { ToXY, IsSame } from './converter';
import { LIST_LAYOUT } from '../constants/list_layout';
import { calcMpyCenter } from './multiplicity_calc';

const spectraDigit = (layout) => {
  switch (layout) {
    case LIST_LAYOUT.IR:
    case LIST_LAYOUT.RAMAN:
    case LIST_LAYOUT.UVVIS:
    case LIST_LAYOUT.HPLC_UVVIS:
    case LIST_LAYOUT.TGA:
    case LIST_LAYOUT.XRD:
    case LIST_LAYOUT.CYCLIC_VOLTAMMETRY:
    case LIST_LAYOUT.CDS:
    case LIST_LAYOUT.SEC:
    case LIST_LAYOUT.MS:
      return 0;
    case LIST_LAYOUT.C13:
      return 1;
    case LIST_LAYOUT.H1:
    case LIST_LAYOUT.F19:
    case LIST_LAYOUT.P31:
    case LIST_LAYOUT.N15:
    case LIST_LAYOUT.Si29:
    case LIST_LAYOUT.PLAIN:
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
  const arr = peaks.map((p) => `${p.x},${p.y}`);
  const str = arr.join('#');
  return str;
};

const spectraOps = {
  [LIST_LAYOUT.PLAIN]: { head: '', tail: '.' },
  [LIST_LAYOUT.H1]: { head: '1H', tail: '.' },
  [LIST_LAYOUT.C13]: { head: '13C', tail: '.' },
  [LIST_LAYOUT.F19]: { head: '19F', tail: '.' },
  [LIST_LAYOUT.P31]: { head: '31P', tail: '.' },
  [LIST_LAYOUT.N15]: { head: '15N', tail: '.' },
  [LIST_LAYOUT.Si29]: { head: '29Si', tail: '.' },
  [LIST_LAYOUT.IR]: { head: 'IR', tail: ' cm-1' },
  [LIST_LAYOUT.RAMAN]: { head: 'RAMAN', tail: ' cm-1' },
  [LIST_LAYOUT.UVVIS]: { head: 'UV-VIS (absorption, solvent), λmax', tail: ' nm' },
  [LIST_LAYOUT.HPLC_UVVIS]: { head: 'HPLC UV/VIS (transmittance)', tail: '' },
  [LIST_LAYOUT.TGA]: { head: 'THERMOGRAVIMETRIC ANALYSIS', tail: ' SECONDS' },
  [LIST_LAYOUT.MS]: { head: 'MASS', tail: ' m/z' },
  [LIST_LAYOUT.XRD]: { head: 'X-RAY DIFFRACTION', tail: '.' },
  [LIST_LAYOUT.CYCLIC_VOLTAMMETRY]: { head: 'CYCLIC VOLTAMMETRY', tail: '.' },
  [LIST_LAYOUT.CDS]: { head: 'CIRCULAR DICHROISM SPECTROSCOPY', tail: '.' },
  [LIST_LAYOUT.SEC]: { head: 'SIZE EXCLUSION CHROMATOGRAPHY', tail: '.' },
  [LIST_LAYOUT.EMISSIONS]: { head: 'EMISSION', tail: '.' },
  [LIST_LAYOUT.DLS_INTENSITY]: { head: 'DLS', tail: '.' },
};

const rmRef = (peaks, shift, atIndex = 0) => {
  if (!shift) return peaks;
  const { shifts } = shift;
  const selectedShift = shifts[atIndex];
  const refValue = selectedShift.ref.value || selectedShift.peak.x;
  return peaks.map(
    (p) => (IsSame(p.x, refValue) ? null : p),
  ).filter((r) => r != null);
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
    .map((k) => ({ x: k, y: ordered[k] }));

  return ordered.map((o) => `${o.x} (${parseInt((100 * o.y / maxY), 10)})`)
    .join(', ');
};

const emLevel = (boundary, val, lowerIsStronger) => {
  const { maxY, minY } = boundary;
  const ratio = lowerIsStronger
    ? 100 * (val - minY) / (maxY - minY)
    : 100 * (maxY - val) / (maxY - minY);
  if (ratio > 85) return 'vw';
  if (ratio > 60) return 'w';
  if (ratio > 45) return 'm';
  if (ratio > 30) return 's';
  return 'vs';
};

const formatedEm = (
  peaks, maxY, decimal = 2, isAscend = true,
  isIntensity = false, boundary = {}, lowerIsStronger = false,
) => {
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
    .map((k) => ({ x: k, y: ordered[k] }));

  if (isIntensity) {
    return ordered.map((o) => `${o.x} (${emLevel(boundary, o.y, lowerIsStronger)})`)
      .join(', ');
  }
  return ordered.map((o) => `${o.x}`)
    .join(', ');
};

const formatedUvVis = (
  peaks, maxY, decimal = 2, isAscend = true,
  isIntensity = false, boundary = {}, lowerIsStronger = false,
) => {
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
    .map((k) => ({ x: k, y: ordered[k] }));

  // return ordered.map(o => `${o.x} (${o.y.toFixed(2)})`)
  //   .join(', ');
  return ordered.map((o) => `${o.x}`)
    .join(', ');
};

const formatedEmissions = (
  peaks, maxY, decimal = 2, isAscend = true,
  isIntensity = false, boundary = {}, lowerIsStronger = false,
) => {
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
    .map((k) => ({ x: k, y: ordered[k] }));
  return ordered.map((o) => `${o.x} nm (${fixDigit(o.y, 2)} a.u.)`).join(', ');
};

const formatedDLSIntensity = (
  peaks, maxY, decimal = 2, isAscend = true,
  isIntensity = false, boundary = {}, lowerIsStronger = false,
) => {
  const ascendFunc = (a, b) => parseFloat(a) - parseFloat(b);
  const descendFunc = (a, b) => parseFloat(b) - parseFloat(a);
  const sortFunc = isAscend ? ascendFunc : descendFunc;
  let ordered = {};

  peaks.forEach((p) => {
    const x = fixDigit(p.x, decimal);
    const better = !ordered[x] || (p.y > ordered[x]);
    if (better) {
      ordered = Object.assign({}, ordered, { [x]: fixDigit(p.y, 2) });
    }
  });

  ordered = Object.keys(ordered).sort(sortFunc)
    .map((k) => ({ x: k, y: ordered[k] }));
  return ordered.map((o) => `${o.x} nm (${o.y} %)`).join(', ');
};

const formatedHplcUvVis = (
  peaks, decimal = 2, integration,
) => {
  let stack = [];
  if (integration) {
    stack = integration.stack;
  }

  let ordered = {};

  peaks.forEach((p) => {
    const x = fixDigit(p.x, decimal);
    const better = !ordered[x] || (p.y > ordered[x]);
    if (better) {
      ordered = Object.assign({}, ordered, { [x]: p.y });
    }
  });

  ordered = Object.keys(ordered)
    .map((k) => ({ x: k, y: ordered[k] }));

  const arrResult = [];
  ordered.forEach((o) => {
    let pStr = `${o.x} (${o.y.toFixed(2)})`;
    if (stack) {
      stack.forEach((s) => {
        if (s.xL <= o.x && s.xU >= o.x) {
          pStr = `${o.x} (${o.y.toFixed(2)}, AUC=${s.absoluteArea})`;
        }
      });
    }
    arrResult.push(pStr);
  });

  return arrResult.join(', ');
};

const rmShiftFromPeaks = (peaks, shift, atIndex = 0) => {
  const peaksXY = ToXY(peaks);
  const { shifts } = shift;
  const selectedShift = shifts[atIndex];
  if (!selectedShift) {
    return peaks;
  }
  // const digit = spectraDigit(layout);
  const rmShiftX = selectedShift.ref.value || selectedShift.peak.x;
  const result = peaksXY.map((p) => {
    const srcX = parseFloat(p[0]);
    const x = IsSame(srcX, rmShiftX) ? null : srcX;
    if (!x) return null;
    const y = parseFloat(p[1]);
    return { x, y };
  }).filter((r) => r != null);
  return result;
};

const peaksBody = ({
  peaks, layout, decimal, shift, isAscend,
  isIntensity = false, boundary = {},
  integration, atIndex = 0,
}) => {
  const result = rmShiftFromPeaks(peaks, shift, atIndex);

  const ascendFunc = (a, b) => parseFloat(a.x) - parseFloat(b.x);
  const descendFunc = (a, b) => parseFloat(b.x) - parseFloat(a.x);
  const sortFunc = isAscend ? ascendFunc : descendFunc;
  const ordered = result.sort(sortFunc);
  const maxY = Math.max(...ordered.map((o) => o.y));

  if (layout === LIST_LAYOUT.MS) {
    return formatedMS(ordered, maxY, decimal, isAscend);
  }
  if (layout === LIST_LAYOUT.IR) {
    return formatedEm(ordered, maxY, decimal, isAscend, isIntensity, boundary, true);
  }
  if (layout === LIST_LAYOUT.UVVIS) {
    return formatedUvVis(ordered, maxY, decimal, isAscend, isIntensity, boundary, false);
  }
  if (layout === LIST_LAYOUT.HPLC_UVVIS) {
    return formatedHplcUvVis(ordered, decimal, integration);
  }
  if (layout === LIST_LAYOUT.EMISSIONS) {
    return formatedEmissions(ordered, maxY, decimal, isAscend, isIntensity, boundary, false);
  }
  if (layout === LIST_LAYOUT.DLS_INTENSITY) {
    return formatedDLSIntensity(ordered, maxY, decimal, isAscend, isIntensity, boundary, false);
  }
  if (layout === LIST_LAYOUT.RAMAN
    || layout === LIST_LAYOUT.TGA
    || layout === LIST_LAYOUT.XRD
    || layout === LIST_LAYOUT.CYCLIC_VOLTAMMETRY
    || layout === LIST_LAYOUT.CDS
    || layout === LIST_LAYOUT.SEC) {
    return formatedEm(ordered, maxY, decimal, isAscend, isIntensity, boundary, false);
  }
  return ordered.map((o) => fixDigit(o.x, decimal)).join(', ');
};

const peaksWrapper = (layout, shift, atIndex = 0) => {
  let solvTxt = '';
  const { shifts } = shift;
  const selectedShift = shifts[atIndex];
  if (selectedShift.ref.label) {
    solvTxt = ` (${selectedShift.ref.label})`;
  }

  if (layout === LIST_LAYOUT.PLAIN || layout === LIST_LAYOUT.DLS_ACF) {
    return { head: '', tail: '' };
  }

  const ops = spectraOps[layout];
  return { head: `${ops.head}${solvTxt} = `, tail: ops.tail };
};

const isNmrLayout = (layoutSt) => (
  [LIST_LAYOUT.H1, LIST_LAYOUT.C13, LIST_LAYOUT.F19, LIST_LAYOUT.P31,
    LIST_LAYOUT.N15, LIST_LAYOUT.Si29].indexOf(layoutSt) >= 0
);
const is29SiLayout = (layoutSt) => (LIST_LAYOUT.Si29 === layoutSt);
const is15NLayout = (layoutSt) => (LIST_LAYOUT.N15 === layoutSt);
const is31PLayout = (layoutSt) => (LIST_LAYOUT.P31 === layoutSt);
const is19FLayout = (layoutSt) => (LIST_LAYOUT.F19 === layoutSt);
const is13CLayout = (layoutSt) => (LIST_LAYOUT.C13 === layoutSt);
const is1HLayout = (layoutSt) => (LIST_LAYOUT.H1 === layoutSt);
const isMsLayout = (layoutSt) => (LIST_LAYOUT.MS === layoutSt);
const isIrLayout = (layoutSt) => ([LIST_LAYOUT.IR, 'INFRARED'].indexOf(layoutSt) >= 0);
const isRamanLayout = (layoutSt) => (LIST_LAYOUT.RAMAN === layoutSt);
const isUvVisLayout = (layoutSt) => (LIST_LAYOUT.UVVIS === layoutSt);
const isHplcUvVisLayout = (layoutSt) => (LIST_LAYOUT.HPLC_UVVIS === layoutSt);
const isTGALayout = (layoutSt) => (LIST_LAYOUT.TGA === layoutSt);
const isXRDLayout = (layoutSt) => (LIST_LAYOUT.XRD === layoutSt);
const isCyclicVoltaLayout = (layoutSt) => (LIST_LAYOUT.CYCLIC_VOLTAMMETRY === layoutSt);
const isCDSLayout = (layoutSt) => (LIST_LAYOUT.CDS === layoutSt);
const isSECLayout = (layoutSt) => (LIST_LAYOUT.SEC === layoutSt);
const isEmWaveLayout = (layoutSt) => (
  [LIST_LAYOUT.IR, LIST_LAYOUT.RAMAN, LIST_LAYOUT.UVVIS,
    LIST_LAYOUT.HPLC_UVVIS].indexOf(layoutSt) >= 0
);
const hasMultiCurves = (layoutSt) => (
  [LIST_LAYOUT.CYCLIC_VOLTAMMETRY, LIST_LAYOUT.SEC, LIST_LAYOUT.AIF].indexOf(layoutSt) >= 0
);
const isAIFLayout = (layoutSt) => (LIST_LAYOUT.AIF === layoutSt);
const isEmissionsLayout = (layoutSt) => (LIST_LAYOUT.EMISSIONS === layoutSt);
const isDLSACFLayout = (layoutSt) => (LIST_LAYOUT.DLS_ACF === layoutSt);
const isDLSIntensityLayout = (layoutSt) => (LIST_LAYOUT.DLS_INTENSITY === layoutSt);

const getNmrTyp = (layout) => {
  switch (layout) {
    case LIST_LAYOUT.H1:
      return 'H';
    case LIST_LAYOUT.C13:
      return 'C';
    case LIST_LAYOUT.F19:
      return 'F';
    case LIST_LAYOUT.P31:
      return 'P';
    case LIST_LAYOUT.N15:
      return 'N';
    case LIST_LAYOUT.Si29:
      return 'Si';
    default:
      return '';
  }
};

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

  const typ = getNmrTyp(layout);

  const ascendFunc = (a, b) => parseFloat(a.k) - parseFloat(b.k);
  const descendFunc = (a, b) => parseFloat(b.k) - parseFloat(a.k);
  const sortFunc = isAscend ? ascendFunc : descendFunc;
  const pArr = Object.keys(pDict).map((k) => {
    if (pDict[k] === 1) return { k, v: k };
    return { k, v: `${k} (${pDict[k]}${typ})` };
  }).sort(sortFunc);

  const body = pArr.map((p) => p.v).join(', ');
  return body;
};

const compareColors = (idx) => ['#ABB2B9', '#EDBB99', '#ABEBC6', '#D2B4DE', '#F9E79F'][idx % 5];

const mutiEntitiesColors = (idx) => ['#fa8231', '#f7b731', '#0fb9b1', '#2d98da', '#3867d6', '#8854d0', '#4b6584'][idx % 7];

const Format = {
  toPeakStr,
  buildData,
  spectraDigit,
  spectraOps,
  peaksBody,
  peaksWrapper,
  rmRef,
  rmShiftFromPeaks,
  isNmrLayout,
  is13CLayout,
  is1HLayout,
  is19FLayout,
  is31PLayout,
  is15NLayout,
  is29SiLayout,
  isMsLayout,
  isIrLayout,
  isRamanLayout,
  isUvVisLayout,
  isHplcUvVisLayout,
  isTGALayout,
  isXRDLayout,
  isCyclicVoltaLayout,
  isCDSLayout,
  isSECLayout,
  isEmissionsLayout,
  isDLSIntensityLayout,
  isEmWaveLayout,
  fixDigit,
  formatPeaksByPrediction,
  formatedMS,
  formatedEm,
  calcMpyCenter,
  compareColors,
  mutiEntitiesColors,
  hasMultiCurves,
  isAIFLayout,
  isDLSACFLayout,
};

export default Format;
