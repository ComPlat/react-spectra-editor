'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcMpyCoup = exports.calcMpyJStr = exports.calcMpyCenter = undefined;

var _jAnalyzer = require('../third_party/jAnalyzer');

var _jAnalyzer2 = _interopRequireDefault(_jAnalyzer);

var _multiplicity = require('./multiplicity');

var _multiplicity_verify_basic = require('./multiplicity_verify_basic');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var centerX = function centerX(ps, shift) {
  var pxs = ps.map(function (p) {
    return p.x;
  }).sort(function (a, b) {
    return a - b;
  });
  var centIdx = (ps.length - 1) / 2;
  if (centIdx < 0) return 0;
  return pxs[centIdx] - shift;
};

var calcMpyCenter = function calcMpyCenter(ps, shift, typ) {
  var count = ps.length;
  var avgX = ps.reduce(function (sum, nxt) {
    return sum + nxt.x;
  }, 0) / ps.length - shift;
  if (typ === 'm') return avgX;
  if (count % 2 === 0) return avgX;
  return centerX(ps, shift);
};

var calcMpyJStr = function calcMpyJStr(js) {
  if (!Array.isArray(js) || js.length === 0) return ' - ';
  var cJ = js.map(function (j) {
    return j.toFixed(3);
  }).join(', ');
  return '' + cJ;
};

var calcMpyPeakWidth = function calcMpyPeakWidth(x, metaSt) {
  var _metaSt$peaks = metaSt.peaks,
      intervalL = _metaSt$peaks.intervalL,
      intervalR = _metaSt$peaks.intervalR,
      deltaX = _metaSt$peaks.deltaX;

  var idxL = null;
  intervalL.every(function (l, idx) {
    if (l.x < x) {
      idxL = idx - 1;
      return false;
    }
    return true;
  });
  var idxR = null;
  intervalR.every(function (l, idx) {
    if (l.x < x) {
      idxR = idx;
      return false;
    }
    return true;
  });
  if (!idxL || !idxR) return 10 * deltaX;
  return Math.abs(intervalL[idxL].x - intervalR[idxR].x);
};

var calcMpyCoup = function calcMpyCoup(pks, metaSt) {
  if (pks.length === 0) return { type: '', js: '' };
  var orderPks = pks.sort(function (a, b) {
    return b.x - a.x;
  });
  var observeFrequency = metaSt.peaks.observeFrequency;

  var peaks = orderPks.map(function (p) {
    return {
      x: p.x,
      intensity: p.y,
      width: calcMpyPeakWidth(p.x, metaSt)
    };
  });

  var signal = {
    nbPeaks: peaks.length,
    observe: observeFrequency,
    nucleus: '1H',
    peaks: peaks
  };
  _jAnalyzer2.default.compilePattern(signal);
  var type = signal.multiplicity;
  var js = signal.nmrJs ? signal.nmrJs.map(function (j) {
    return j.coupling;
  }).sort() : [];

  var isTPCMatch = (0, _multiplicity_verify_basic.verifyTypePeakCount)(type, peaks);
  if (!isTPCMatch) return { type: 'm', js: [] };

  if (['s', 'm'].indexOf(type) >= 0) return { type: type, js: js };

  var oivs = (0, _multiplicity.getInterval)(orderPks);
  if (type === 't') return (0, _multiplicity_verify_basic.verifyTypeT)(type, js, oivs, metaSt);
  if (type === 'q') return (0, _multiplicity_verify_basic.verifyTypeQ)(type, js, oivs, metaSt);
  if (type === 'quint') return (0, _multiplicity_verify_basic.verifyTypeQuint)(type, js, oivs, metaSt);
  if (type === 'h') return (0, _multiplicity_verify_basic.verifyTypeH)(type, js, oivs, metaSt);
  if (type === 'sept') return (0, _multiplicity_verify_basic.verifyTypeSept)(type, js, oivs, metaSt);
  if (type === 'o') return (0, _multiplicity_verify_basic.verifyTypeO)(type, js, oivs, metaSt);
  return { type: type, js: js };
};

exports.calcMpyCenter = calcMpyCenter;
exports.calcMpyJStr = calcMpyJStr;
exports.calcMpyCoup = calcMpyCoup;