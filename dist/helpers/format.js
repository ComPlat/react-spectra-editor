"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _jcampconverter = _interopRequireDefault(require("jcampconverter"));
var _converter = require("./converter");
var _list_layout = require("../constants/list_layout");
var _multiplicity_calc = require("./multiplicity_calc");
/* eslint-disable prefer-destructuring */
/* eslint-disable no-mixed-operators, prefer-object-spread,
function-paren-newline, no-unused-vars, default-param-last */

const spectraDigit = layout => {
  switch (layout) {
    case _list_layout.LIST_LAYOUT.IR:
    case _list_layout.LIST_LAYOUT.RAMAN:
    case _list_layout.LIST_LAYOUT.UVVIS:
    case _list_layout.LIST_LAYOUT.HPLC_UVVIS:
    case _list_layout.LIST_LAYOUT.TGA:
    case _list_layout.LIST_LAYOUT.DSC:
    case _list_layout.LIST_LAYOUT.XRD:
    case _list_layout.LIST_LAYOUT.CDS:
    case _list_layout.LIST_LAYOUT.SEC:
    case _list_layout.LIST_LAYOUT.GC:
    case _list_layout.LIST_LAYOUT.MS:
      return 0;
    case _list_layout.LIST_LAYOUT.C13:
      return 1;
    case _list_layout.LIST_LAYOUT.H1:
    case _list_layout.LIST_LAYOUT.F19:
    case _list_layout.LIST_LAYOUT.P31:
    case _list_layout.LIST_LAYOUT.N15:
    case _list_layout.LIST_LAYOUT.Si29:
    case _list_layout.LIST_LAYOUT.PLAIN:
    case _list_layout.LIST_LAYOUT.LSV:
    case _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY:
    default:
      return 2;
  }
};
const fixDigit = (input, precision) => {
  const output = input || 0.0;
  return output.toFixed(precision);
};
const buildData = entity => {
  if (!entity) return {
    isExist: false
  };
  const sp = entity && entity.spectrum;
  const xLabel = sp ? `X (${sp.xUnit})` : '';
  const yLabel = sp ? `Y (${sp.yUnit})` : '';
  return {
    entity,
    xLabel,
    yLabel,
    isExist: true
  };
};
const toPeakStr = peaks => {
  const arr = peaks.map(p => `${p.x},${p.y}`);
  const str = arr.join('#');
  return str;
};
const spectraOps = {
  [_list_layout.LIST_LAYOUT.PLAIN]: {
    head: '',
    tail: '.'
  },
  [_list_layout.LIST_LAYOUT.H1]: {
    head: '1H',
    tail: '.'
  },
  [_list_layout.LIST_LAYOUT.C13]: {
    head: '13C',
    tail: '.'
  },
  [_list_layout.LIST_LAYOUT.F19]: {
    head: '19F',
    tail: '.'
  },
  [_list_layout.LIST_LAYOUT.P31]: {
    head: '31P',
    tail: '.'
  },
  [_list_layout.LIST_LAYOUT.N15]: {
    head: '15N',
    tail: '.'
  },
  [_list_layout.LIST_LAYOUT.Si29]: {
    head: '29Si',
    tail: '.'
  },
  [_list_layout.LIST_LAYOUT.IR]: {
    head: 'IR',
    tail: ' cm-1'
  },
  [_list_layout.LIST_LAYOUT.RAMAN]: {
    head: 'RAMAN',
    tail: ' cm-1'
  },
  [_list_layout.LIST_LAYOUT.UVVIS]: {
    head: 'UV-VIS (absorption, solvent), λmax',
    tail: ' nm'
  },
  [_list_layout.LIST_LAYOUT.HPLC_UVVIS]: {
    head: 'HPLC UV/VIS (transmittance)',
    tail: ''
  },
  [_list_layout.LIST_LAYOUT.TGA]: {
    head: 'THERMOGRAVIMETRIC ANALYSIS',
    tail: ' SECONDS'
  },
  [_list_layout.LIST_LAYOUT.DSC]: {
    head: 'DIFFERENTIAL SCANNING CALORIMETRY',
    tail: ' SECONDS'
  },
  [_list_layout.LIST_LAYOUT.MS]: {
    head: 'MASS',
    tail: ' m/z'
  },
  [_list_layout.LIST_LAYOUT.XRD]: {
    head: 'XRD',
    tail: '.'
  },
  [_list_layout.LIST_LAYOUT.LSV]: {
    head: 'LSV',
    tail: '.'
  },
  [_list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY]: {
    head: 'CV',
    tail: '.'
  },
  [_list_layout.LIST_LAYOUT.CDS]: {
    head: 'CIRCULAR DICHROISM SPECTROSCOPY',
    tail: '.'
  },
  [_list_layout.LIST_LAYOUT.SEC]: {
    head: 'SIZE EXCLUSION CHROMATOGRAPHY',
    tail: '.'
  },
  [_list_layout.LIST_LAYOUT.GC]: {
    head: 'GAS CHROMATOGRAPHY',
    tail: '.'
  },
  [_list_layout.LIST_LAYOUT.EMISSIONS]: {
    head: 'EMISSION',
    tail: '.'
  },
  [_list_layout.LIST_LAYOUT.DLS_INTENSITY]: {
    head: 'DLS',
    tail: '.'
  }
};
const rmRef = (peaks, shift, atIndex = 0) => {
  if (!shift) return peaks;
  const {
    shifts
  } = shift;
  const selectedShift = shifts[atIndex];
  const refValue = selectedShift.ref.value || selectedShift.peak.x;
  return peaks.map(p => (0, _converter.IsSame)(p.x, refValue) ? null : p).filter(r => r != null);
};
const formatedMS = (peaks, maxY, decimal = 2, isAscend = true) => {
  const ascendFunc = (a, b) => parseFloat(a) - parseFloat(b);
  const descendFunc = (a, b) => parseFloat(b) - parseFloat(a);
  const sortFunc = isAscend ? ascendFunc : descendFunc;
  let ordered = {};
  peaks.forEach(p => {
    const x = fixDigit(p.x, decimal);
    const better = !ordered[x] || p.y > ordered[x];
    if (better) {
      ordered = Object.assign({}, ordered, {
        [x]: p.y
      });
    }
  });
  ordered = Object.keys(ordered).sort(sortFunc).map(k => ({
    x: k,
    y: ordered[k]
  }));
  return ordered.map(o => `${o.x} (${parseInt(100 * o.y / maxY, 10)})`).join(', ');
};
const emLevel = (boundary, val, lowerIsStronger) => {
  const {
    maxY,
    minY
  } = boundary;
  const ratio = lowerIsStronger ? 100 * (val - minY) / (maxY - minY) : 100 * (maxY - val) / (maxY - minY);
  if (ratio > 85) return 'vw';
  if (ratio > 60) return 'w';
  if (ratio > 45) return 'm';
  if (ratio > 30) return 's';
  return 'vs';
};
const formatedEm = (peaks, maxY, decimal = 2, isAscend = true, isIntensity = false, boundary = {}, lowerIsStronger = false) => {
  const ascendFunc = (a, b) => parseFloat(a) - parseFloat(b);
  const descendFunc = (a, b) => parseFloat(b) - parseFloat(a);
  const sortFunc = isAscend ? ascendFunc : descendFunc;
  let ordered = {};
  peaks.forEach(p => {
    const x = fixDigit(p.x, decimal);
    const better = !ordered[x] || p.y > ordered[x];
    if (better) {
      ordered = Object.assign({}, ordered, {
        [x]: p.y
      });
    }
  });
  ordered = Object.keys(ordered).sort(sortFunc).map(k => ({
    x: k,
    y: ordered[k]
  }));
  if (isIntensity) {
    return ordered.map(o => `${o.x} (${emLevel(boundary, o.y, lowerIsStronger)})`).join(', ');
  }
  return ordered.map(o => `${o.x}`).join(', ');
};
const formatedUvVis = (peaks, maxY, decimal = 2, isAscend = true, isIntensity = false, boundary = {}, lowerIsStronger = false) => {
  const ascendFunc = (a, b) => parseFloat(a) - parseFloat(b);
  const descendFunc = (a, b) => parseFloat(b) - parseFloat(a);
  const sortFunc = isAscend ? ascendFunc : descendFunc;
  let ordered = {};
  peaks.forEach(p => {
    const x = fixDigit(p.x, decimal);
    const better = !ordered[x] || p.y > ordered[x];
    if (better) {
      ordered = Object.assign({}, ordered, {
        [x]: p.y
      });
    }
  });
  ordered = Object.keys(ordered).sort(sortFunc).map(k => ({
    x: k,
    y: ordered[k]
  }));

  // return ordered.map(o => `${o.x} (${o.y.toFixed(2)})`)
  //   .join(', ');
  return ordered.map(o => `${o.x}`).join(', ');
};
const formatedEmissions = (peaks, maxY, decimal = 2, isAscend = true, isIntensity = false, boundary = {}, lowerIsStronger = false) => {
  const ascendFunc = (a, b) => parseFloat(a) - parseFloat(b);
  const descendFunc = (a, b) => parseFloat(b) - parseFloat(a);
  const sortFunc = isAscend ? ascendFunc : descendFunc;
  let ordered = {};
  peaks.forEach(p => {
    const x = fixDigit(p.x, decimal);
    const better = !ordered[x] || p.y > ordered[x];
    if (better) {
      ordered = Object.assign({}, ordered, {
        [x]: p.y
      });
    }
  });
  ordered = Object.keys(ordered).sort(sortFunc).map(k => ({
    x: k,
    y: ordered[k]
  }));
  return ordered.map(o => `${o.x} nm (${fixDigit(o.y, 2)} a.u.)`).join(', ');
};
const formatedDLSIntensity = (peaks, maxY, decimal = 2, isAscend = true, isIntensity = false, boundary = {}, lowerIsStronger = false) => {
  const ascendFunc = (a, b) => parseFloat(a) - parseFloat(b);
  const descendFunc = (a, b) => parseFloat(b) - parseFloat(a);
  const sortFunc = isAscend ? ascendFunc : descendFunc;
  let ordered = {};
  peaks.forEach(p => {
    const x = fixDigit(p.x, decimal);
    const better = !ordered[x] || p.y > ordered[x];
    if (better) {
      ordered = Object.assign({}, ordered, {
        [x]: fixDigit(p.y, 2)
      });
    }
  });
  ordered = Object.keys(ordered).sort(sortFunc).map(k => ({
    x: k,
    y: ordered[k]
  }));
  return ordered.map(o => `${o.x} nm (${o.y} %)`).join(', ');
};
const formatedHplcUvVis = (peaks, decimal = 2, integration) => {
  let stack = [];
  if (integration) {
    stack = integration.stack;
  }
  let ordered = {};
  peaks.forEach(p => {
    const x = fixDigit(p.x, decimal);
    const better = !ordered[x] || p.y > ordered[x];
    if (better) {
      ordered = Object.assign({}, ordered, {
        [x]: p.y
      });
    }
  });
  ordered = Object.keys(ordered).map(k => ({
    x: k,
    y: ordered[k]
  }));
  const arrResult = [];
  ordered.forEach(o => {
    let pStr = `${o.x} (${o.y.toFixed(2)})`;
    if (stack) {
      stack.forEach(s => {
        if (s.xL <= o.x && s.xU >= o.x) {
          pStr = `${o.x} (${o.y.toFixed(2)}, AUC=${s.absoluteArea})`;
        }
      });
    }
    arrResult.push(pStr);
  });
  return arrResult.join(', ');
};
const formatedXRD = (peaks, isAscend = true, waveLength, temperature) => {
  const ascendFunc = (a, b) => parseFloat(a) - parseFloat(b);
  const descendFunc = (a, b) => parseFloat(b) - parseFloat(a);
  const sortFunc = isAscend ? ascendFunc : descendFunc;
  let ordered = {};
  peaks.forEach(p => {
    const x = fixDigit(p.x, 1);
    const better = !ordered[x] || p.y > ordered[x];
    if (better) {
      ordered = Object.assign({}, ordered, {
        [x]: p.y
      });
    }
  });
  const XRDSource = waveLength.label;
  const XRDWavelength = `${waveLength.value} ${waveLength.unit}`;
  ordered = Object.keys(ordered).sort(sortFunc).map(k => ({
    x: k,
    y: ordered[k]
  }));
  return `(${XRDSource}, ${XRDWavelength}, ${temperature} °C), 2θ [°] (d [nm]): ${ordered.map(o => `${o.x} (${fixDigit(o.y, 2)})`).join(', ')}`;
};
const rmShiftFromPeaks = (peaks, shift, atIndex = 0) => {
  const peaksXY = (0, _converter.ToXY)(peaks);
  const {
    shifts
  } = shift;
  const selectedShift = shifts[atIndex];
  if (!selectedShift) {
    return peaks;
  }
  // const digit = spectraDigit(layout);
  const rmShiftX = selectedShift.ref.value || selectedShift.peak.x;
  const result = peaksXY.map(p => {
    const srcX = parseFloat(p[0]);
    const x = (0, _converter.IsSame)(srcX, rmShiftX) ? null : srcX;
    if (!x) return null;
    const y = parseFloat(p[1]);
    return {
      x,
      y
    };
  }).filter(r => r != null);
  return result;
};
const peaksBody = ({
  peaks,
  layout,
  decimal,
  shift,
  isAscend,
  isIntensity = false,
  boundary = {},
  integration,
  atIndex = 0,
  waveLength,
  temperature
}) => {
  const result = rmShiftFromPeaks(peaks, shift, atIndex);
  const ascendFunc = (a, b) => parseFloat(a.x) - parseFloat(b.x);
  const descendFunc = (a, b) => parseFloat(b.x) - parseFloat(a.x);
  const sortFunc = isAscend ? ascendFunc : descendFunc;
  const ordered = result.sort(sortFunc);
  const maxY = Math.max(...ordered.map(o => o.y));
  if (layout === _list_layout.LIST_LAYOUT.MS) {
    return formatedMS(ordered, maxY, decimal, isAscend);
  }
  if (layout === _list_layout.LIST_LAYOUT.IR) {
    return formatedEm(ordered, maxY, decimal, isAscend, isIntensity, boundary, true);
  }
  if (layout === _list_layout.LIST_LAYOUT.UVVIS) {
    return formatedUvVis(ordered, maxY, decimal, isAscend, isIntensity, boundary, false);
  }
  if (layout === _list_layout.LIST_LAYOUT.HPLC_UVVIS) {
    return formatedHplcUvVis(ordered, decimal, integration);
  }
  if (layout === _list_layout.LIST_LAYOUT.EMISSIONS) {
    return formatedEmissions(ordered, maxY, decimal, isAscend, isIntensity, boundary, false);
  }
  if (layout === _list_layout.LIST_LAYOUT.DLS_INTENSITY) {
    return formatedDLSIntensity(ordered, maxY, decimal, isAscend, isIntensity, boundary, false);
  }
  if (layout === _list_layout.LIST_LAYOUT.RAMAN || layout === _list_layout.LIST_LAYOUT.TGA || layout === _list_layout.LIST_LAYOUT.DSC || layout === _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY || layout === _list_layout.LIST_LAYOUT.LSV || layout === _list_layout.LIST_LAYOUT.CDS || layout === _list_layout.LIST_LAYOUT.SEC || layout === _list_layout.LIST_LAYOUT.GC) {
    return formatedEm(ordered, maxY, decimal, isAscend, isIntensity, boundary, false);
  }
  if (layout === _list_layout.LIST_LAYOUT.XRD) {
    return formatedXRD(ordered, isAscend, waveLength, temperature);
  }
  return ordered.map(o => fixDigit(o.x, decimal)).join(', ');
};
const peaksWrapper = (layout, shift, atIndex = 0) => {
  let solvTxt = '';
  const {
    shifts
  } = shift;
  const selectedShift = shifts[atIndex];
  if (selectedShift.ref.label) {
    solvTxt = ` (${selectedShift.ref.label})`;
  }
  if (layout === _list_layout.LIST_LAYOUT.PLAIN || layout === _list_layout.LIST_LAYOUT.DLS_ACF) {
    return {
      head: '',
      tail: ''
    };
  }
  const ops = spectraOps[layout];
  return {
    head: `${ops.head}${solvTxt} = `,
    tail: ops.tail
  };
};
const isNmrLayout = layoutSt => [_list_layout.LIST_LAYOUT.H1, _list_layout.LIST_LAYOUT.C13, _list_layout.LIST_LAYOUT.F19, _list_layout.LIST_LAYOUT.P31, _list_layout.LIST_LAYOUT.N15, _list_layout.LIST_LAYOUT.Si29].indexOf(layoutSt) >= 0;
const is29SiLayout = layoutSt => _list_layout.LIST_LAYOUT.Si29 === layoutSt;
const is15NLayout = layoutSt => _list_layout.LIST_LAYOUT.N15 === layoutSt;
const is31PLayout = layoutSt => _list_layout.LIST_LAYOUT.P31 === layoutSt;
const is19FLayout = layoutSt => _list_layout.LIST_LAYOUT.F19 === layoutSt;
const is13CLayout = layoutSt => _list_layout.LIST_LAYOUT.C13 === layoutSt;
const is1HLayout = layoutSt => _list_layout.LIST_LAYOUT.H1 === layoutSt;
const isMsLayout = layoutSt => _list_layout.LIST_LAYOUT.MS === layoutSt;
const isIrLayout = layoutSt => [_list_layout.LIST_LAYOUT.IR, 'INFRARED'].indexOf(layoutSt) >= 0;
const isRamanLayout = layoutSt => _list_layout.LIST_LAYOUT.RAMAN === layoutSt;
const isUvVisLayout = layoutSt => _list_layout.LIST_LAYOUT.UVVIS === layoutSt;
const isHplcUvVisLayout = layoutSt => _list_layout.LIST_LAYOUT.HPLC_UVVIS === layoutSt;
const isTGALayout = layoutSt => _list_layout.LIST_LAYOUT.TGA === layoutSt;
const isDSCLayout = layoutSt => _list_layout.LIST_LAYOUT.DSC === layoutSt;
const isXRDLayout = layoutSt => _list_layout.LIST_LAYOUT.XRD === layoutSt;
const isLSVLayout = layoutSt => _list_layout.LIST_LAYOUT.LSV === layoutSt;
const isCyclicVoltaLayout = layoutSt => _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY === layoutSt;
const isCDSLayout = layoutSt => _list_layout.LIST_LAYOUT.CDS === layoutSt;
const isSECLayout = layoutSt => _list_layout.LIST_LAYOUT.SEC === layoutSt;
const isGCLayout = layoutSt => _list_layout.LIST_LAYOUT.GC === layoutSt;
const isEmWaveLayout = layoutSt => [_list_layout.LIST_LAYOUT.IR, _list_layout.LIST_LAYOUT.RAMAN, _list_layout.LIST_LAYOUT.UVVIS, _list_layout.LIST_LAYOUT.HPLC_UVVIS].indexOf(layoutSt) >= 0;
const hasMultiCurves = layoutSt => [_list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY, _list_layout.LIST_LAYOUT.LSV, _list_layout.LIST_LAYOUT.SEC, _list_layout.LIST_LAYOUT.GC, _list_layout.LIST_LAYOUT.AIF].indexOf(layoutSt) >= 0;
const isAIFLayout = layoutSt => _list_layout.LIST_LAYOUT.AIF === layoutSt;
const isEmissionsLayout = layoutSt => _list_layout.LIST_LAYOUT.EMISSIONS === layoutSt;
const isDLSACFLayout = layoutSt => _list_layout.LIST_LAYOUT.DLS_ACF === layoutSt;
const isDLSIntensityLayout = layoutSt => _list_layout.LIST_LAYOUT.DLS_INTENSITY === layoutSt;
const getNmrTyp = layout => {
  switch (layout) {
    case _list_layout.LIST_LAYOUT.H1:
      return 'H';
    case _list_layout.LIST_LAYOUT.C13:
      return 'C';
    case _list_layout.LIST_LAYOUT.F19:
      return 'F';
    case _list_layout.LIST_LAYOUT.P31:
      return 'P';
    case _list_layout.LIST_LAYOUT.N15:
      return 'N';
    case _list_layout.LIST_LAYOUT.Si29:
      return 'Si';
    default:
      return '';
  }
};
const formatPeaksByPrediction = (peaks, layout, isAscend, decimal, predictions = []) => {
  const pDict = {};
  peaks.forEach(p => {
    pDict[p.x.toFixed(decimal)] = 0;
  });
  predictions.forEach(p => {
    const key = p.real.toFixed(decimal);
    if (typeof pDict[key] === 'number') {
      pDict[key] += 1;
    }
  });
  const typ = getNmrTyp(layout);
  const ascendFunc = (a, b) => parseFloat(a.k) - parseFloat(b.k);
  const descendFunc = (a, b) => parseFloat(b.k) - parseFloat(a.k);
  const sortFunc = isAscend ? ascendFunc : descendFunc;
  const pArr = Object.keys(pDict).map(k => {
    if (pDict[k] === 1) return {
      k,
      v: k
    };
    return {
      k,
      v: `${k} (${pDict[k]}${typ})`
    };
  }).sort(sortFunc);
  const body = pArr.map(p => p.v).join(', ');
  return body;
};
const compareColors = idx => ['#ABB2B9', '#EDBB99', '#ABEBC6', '#D2B4DE', '#F9E79F'][idx % 5];
const mutiEntitiesColors = idx => ['#d35400', '#2980b9', '#8e44ad', '#2c3e50', '#6D214F', '#182C61', '#BDC581'][idx % 7];
const strNumberFixedDecimal = (number, decimal = -1) => {
  if (decimal <= 0) {
    return `${number}`;
  }
  return number.toFixed(Math.max(decimal, (number.toString().split('.')[1] || []).length));
};
const strNumberFixedLength = (number, maxLength = -1) => {
  if (maxLength <= 0) {
    return `${number}`;
  }
  const splittedNum = number.toString().split('.') || [];
  if (splittedNum.length === 0) {
    return `${number}`;
  }
  const integerPart = splittedNum[0];
  if (number >= 0 && maxLength <= integerPart.length || number < 0 && maxLength <= integerPart.length - 1) {
    // eslint-disable-line
    return `${Math.round(number)}`;
  }
  const lengthToFix = number >= 0 ? maxLength - integerPart.length : maxLength - integerPart.length + 1; // eslint-disable-line

  return number.toFixed(lengthToFix);
};
const inlineNotation = (layout, data, sampleName = '') => {
  let formattedString = '';
  let quillData = [];
  const {
    scanRate,
    voltaData
  } = data;
  switch (layout) {
    case _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY:
      {
        if (!voltaData) {
          break;
        }
        let refString = '';
        let nonRefString = '';
        let refOps = [];
        const nonRefOps = [];
        const {
          listPeaks,
          xyData
        } = voltaData;
        const {
          x
        } = xyData;
        listPeaks.forEach(item => {
          const {
            isRef,
            e12,
            max,
            min
          } = item;
          const e12Str = e12 ? strNumberFixedLength(e12, 3) : '0';
          const scanRateStr = scanRate ? strNumberFixedLength(scanRate, 3) : '0';
          if (isRef) {
            const posNegString = x[0] > x[1] ? 'neg.' : 'pos.';
            refString = `CV (<conc. of sample> mM in <solvent> vs. Ref (Fc+/Fc) = ${e12Str} V, v = ${scanRateStr} V/s, to ${posNegString}):`;
            refOps = [{
              insert: 'CV (<conc. of sample> mM in <solvent> vs. Ref '
            }, {
              insert: '(Fc'
            }, {
              insert: '+',
              attributes: {
                script: 'super'
              }
            }, {
              insert: '/Fc) '
            }, {
              insert: `= ${e12Str} V, v = ${scanRateStr} V/s, to ${posNegString}):`
            }];
          } else {
            const delta = max && min ? strNumberFixedLength(Math.abs(max.x - min.x) * 1000, 3) : '0';
            nonRefString += `\nE1/2 = ([${sampleName}] , ΔEp) = ${e12Str} V (${delta} mV)`;
            const currentNoneOps = [{
              insert: '\nE'
            }, {
              insert: '1/2',
              attributes: {
                script: 'sub'
              }
            }, {
              insert: ` = ([${sampleName}] , ΔE`
            }, {
              insert: 'p',
              attributes: {
                script: 'sub'
              }
            }, {
              insert: `) = ${e12Str} V (${delta} mV)`
            }];
            nonRefOps.push(...currentNoneOps);
          }
        });
        formattedString = refString + nonRefString;
        quillData = [...refOps, ...nonRefOps];
        break;
      }
    default:
      break;
  }
  return {
    quillData,
    formattedString
  };
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
  isDSCLayout,
  isXRDLayout,
  isLSVLayout,
  isCyclicVoltaLayout,
  isCDSLayout,
  isSECLayout,
  isEmissionsLayout,
  isDLSIntensityLayout,
  isEmWaveLayout,
  isGCLayout,
  fixDigit,
  formatPeaksByPrediction,
  formatedMS,
  formatedEm,
  calcMpyCenter: _multiplicity_calc.calcMpyCenter,
  compareColors,
  mutiEntitiesColors,
  hasMultiCurves,
  isAIFLayout,
  isDLSACFLayout,
  strNumberFixedDecimal,
  formatedXRD,
  strNumberFixedLength,
  inlineNotation
};
var _default = exports.default = Format;