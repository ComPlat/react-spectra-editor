"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcMpyJStr = exports.calcMpyCoup = exports.calcMpyCenter = void 0;
var _jAnalyzer = _interopRequireDefault(require("../third_party/jAnalyzer"));
var _multiplicity = require("./multiplicity");
var _multiplicity_verify_basic = require("./multiplicity_verify_basic");
/* eslint-disable prefer-object-spread, default-param-last */

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
exports.calcMpyCenter = calcMpyCenter;
const calcMpyJStr = js => {
  if (!Array.isArray(js) || js.length === 0) return ' - ';
  const cJ = js.map(j => j.toFixed(3)).join(', ');
  return `${cJ}`;
};
exports.calcMpyJStr = calcMpyJStr;
const calcMpyPeakWidth = (x, metaSt) => {
  const {
    intervalL,
    intervalR,
    deltaX
  } = metaSt.peaks;
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
  if (pks.length === 0) return {
    type: '',
    js: ''
  };
  const orderPks = pks.sort((a, b) => b.x - a.x);
  const {
    observeFrequency
  } = metaSt.peaks;
  const peaks = orderPks.map(p => ({
    x: p.x,
    intensity: p.y,
    width: calcMpyPeakWidth(p.x, metaSt)
  }));
  const signal = {
    nbPeaks: peaks.length,
    observe: observeFrequency,
    nucleus: '1H',
    peaks
  };
  _jAnalyzer.default.compilePattern(signal);
  const type = signal.multiplicity;
  const js = signal.nmrJs ? signal.nmrJs.map(j => j.coupling).sort() : [];
  const isTPCMatch = (0, _multiplicity_verify_basic.verifyTypePeakCount)(type, peaks);
  if (!isTPCMatch) return {
    type: 'm',
    js: []
  };
  if (['s', 'm'].indexOf(type) >= 0) return {
    type,
    js
  };
  const oivs = (0, _multiplicity.getInterval)(orderPks);
  if (type === 't') return (0, _multiplicity_verify_basic.verifyTypeT)(type, js, oivs, metaSt);
  if (type === 'q') return (0, _multiplicity_verify_basic.verifyTypeQ)(type, js, oivs, metaSt);
  if (type === 'quint') return (0, _multiplicity_verify_basic.verifyTypeQuint)(type, js, oivs, metaSt);
  if (type === 'h') return (0, _multiplicity_verify_basic.verifyTypeH)(type, js, oivs, metaSt);
  if (type === 'sept') return (0, _multiplicity_verify_basic.verifyTypeSept)(type, js, oivs, metaSt);
  if (type === 'o') return (0, _multiplicity_verify_basic.verifyTypeO)(type, js, oivs, metaSt);
  return {
    type,
    js
  };
};
exports.calcMpyCoup = calcMpyCoup;