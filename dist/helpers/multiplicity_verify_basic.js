'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// ---------------------------------------------------------------
// verifyTypePeakCount
// ---------------------------------------------------------------

var verifyTypePeakCount = function verifyTypePeakCount(type, peaks) {
  var isBasicWrong = type === 's' && peaks.length > 1 || type === 'd' && peaks.length > 2 || type === 't' && peaks.length > 3 || type === 'q' && peaks.length > 4 || type === 'quint' && peaks.length > 5 || type === 'h' && peaks.length > 6 || type === 'sept' && peaks.length > 7 || type === 'o' && peaks.length > 8 || type === 'n' && peaks.length > 9;
  var limit = 1;
  var mStr = type;
  limit *= Math.pow(5, (mStr.match(/quint/g) || []).length);
  mStr = mStr.replace(/quint/g, '');
  limit *= Math.pow(7, (mStr.match(/sept/g) || []).length);
  mStr = mStr.replace(/sept/g, '');
  limit *= Math.pow(2, (mStr.match(/d/g) || []).length);
  mStr = mStr.replace(/d/g, '');
  limit *= Math.pow(3, (mStr.match(/t/g) || []).length);
  mStr = mStr.replace(/t/g, '');
  limit *= Math.pow(4, (mStr.match(/q/g) || []).length);
  mStr = mStr.replace(/q/g, '');
  limit *= Math.pow(6, (mStr.match(/h/g) || []).length);
  mStr = mStr.replace(/h/g, '');
  limit *= Math.pow(8, (mStr.match(/o/g) || []).length);
  mStr = mStr.replace(/o/g, '');
  limit *= Math.pow(9, (mStr.match(/n/g) || []).length);
  mStr = mStr.replace(/n/g, '');
  var isAdvanWrong = peaks.length > limit;
  return !(isBasicWrong || isAdvanWrong);
};

// ---------------------------------------------------------------
// Basic Multiplicity verification
// ---------------------------------------------------------------

var allowedTolerance = 0.15;

var faktor = 1.1;

var passRuleIntervalCounts = function passRuleIntervalCounts(oivs, limit) {
  return oivs.length === limit;
};

var getRuleParams = function getRuleParams(oivs, metaSt) {
  var _metaSt$peaks = metaSt.peaks,
      deltaX = _metaSt$peaks.deltaX,
      observeFrequency = _metaSt$peaks.observeFrequency;

  var sivs = [].concat(_toConsumableArray(oivs)).sort(function (a, b) {
    return b - a;
  });
  var ref = sivs[0];
  var rDeltaX = Math.abs(2 * deltaX / ref);
  var tTolerance = rDeltaX > allowedTolerance ? rDeltaX : allowedTolerance;
  var tolerance = Math.abs(tTolerance * faktor);
  var roivs = oivs.map(function (oiv) {
    return oiv / ref;
  });
  var rsivs = sivs.map(function (siv) {
    return siv / ref;
  });
  return {
    roivs: roivs, rsivs: rsivs, tolerance: tolerance, observeFrequency: observeFrequency
  };
};

var verifyTypeT = function verifyTypeT(type, js, oivs, metaSt) {
  if (!passRuleIntervalCounts(oivs, 2)) return { type: 'm', js: [] };

  var _getRuleParams = getRuleParams(oivs, metaSt),
      rsivs = _getRuleParams.rsivs,
      tolerance = _getRuleParams.tolerance;

  var isT = Math.abs(rsivs[0] - rsivs[1]) < tolerance;
  if (isT) return { type: type, js: js };
  return { type: 'm', js: [] };
};

var verifyTypeQ = function verifyTypeQ(type, js, oivs, metaSt) {
  if (!passRuleIntervalCounts(oivs, 3)) return { type: 'm', js: [] };

  var _getRuleParams2 = getRuleParams(oivs, metaSt),
      roivs = _getRuleParams2.roivs,
      rsivs = _getRuleParams2.rsivs,
      tolerance = _getRuleParams2.tolerance,
      observeFrequency = _getRuleParams2.observeFrequency;

  var isQ = Math.abs(rsivs[0] - rsivs[2]) < tolerance;
  if (isQ) return { type: type, js: js };

  var isDD = Math.abs(roivs[0] - roivs[2]) < tolerance && Math.abs(roivs[0] - roivs[1]) >= tolerance;
  var ddJs = [oivs[0] * observeFrequency, (oivs[0] + oivs[1]) * observeFrequency];
  if (isDD) return { type: 'dd', js: ddJs };
  return { type: 'm', js: [] };
};

var verifyTypeQuint = function verifyTypeQuint(type, js, oivs, metaSt) {
  if (!passRuleIntervalCounts(oivs, 4)) return { type: 'm', js: [] };

  var _getRuleParams3 = getRuleParams(oivs, metaSt),
      rsivs = _getRuleParams3.rsivs,
      tolerance = _getRuleParams3.tolerance;

  var isQuint = Math.abs(rsivs[0] - rsivs[3]) < tolerance;
  if (isQuint) return { type: type, js: js };
  return { type: 'm', js: [] };
};

var verifyTypeH = function verifyTypeH(type, js, oivs, metaSt) {
  if (!passRuleIntervalCounts(oivs, 5)) return { type: 'm', js: [] };

  var _getRuleParams4 = getRuleParams(oivs, metaSt),
      roivs = _getRuleParams4.roivs,
      rsivs = _getRuleParams4.rsivs,
      tolerance = _getRuleParams4.tolerance,
      observeFrequency = _getRuleParams4.observeFrequency;

  var isH = Math.abs(rsivs[0] - rsivs[4]) < tolerance;
  if (isH) return { type: type, js: js };
  var isTD = Math.abs(roivs[0] - roivs[2]) < tolerance && Math.abs(roivs[0] - roivs[4]) < tolerance && Math.abs(roivs[1] - roivs[3]) < tolerance && Math.abs(roivs[0] - roivs[1]) >= tolerance;
  var tdJs = [oivs[0] * observeFrequency, (oivs[0] + oivs[1]) * observeFrequency];
  if (isTD) return { type: 'td', js: tdJs };
  var isDT1 = Math.abs(roivs[0] - roivs[1]) < tolerance && Math.abs(roivs[0] - roivs[3]) < tolerance && Math.abs(roivs[0] - roivs[4]) < tolerance && Math.abs(roivs[0] - roivs[2]) >= tolerance;
  var dt1Js = [oivs[0] * observeFrequency, (oivs[1] + oivs[2] + oivs[3]) * observeFrequency];
  if (isDT1) return { type: 'dt', js: dt1Js };
  var isDT2 = Math.abs(roivs[0] - roivs[4]) < tolerance && Math.abs(roivs[0] - roivs[1] - roivs[2]) < tolerance && Math.abs(roivs[0] - roivs[2] - roivs[3]) < tolerance && Math.abs(roivs[0] - roivs[2]) >= tolerance;
  var dt2Js = [oivs[0] * observeFrequency, (oivs[1] + oivs[2] + oivs[3]) * observeFrequency];
  if (isDT2) return { type: 'dt', js: dt2Js };
  return { type: 'm', js: [] };
};

var verifyTypeSept = function verifyTypeSept(type, js, oivs, metaSt) {
  if (!passRuleIntervalCounts(oivs, 6)) return { type: 'm', js: [] };

  var _getRuleParams5 = getRuleParams(oivs, metaSt),
      roivs = _getRuleParams5.roivs,
      rsivs = _getRuleParams5.rsivs,
      tolerance = _getRuleParams5.tolerance,
      observeFrequency = _getRuleParams5.observeFrequency;

  var isSept = Math.abs(rsivs[0] - rsivs[5]) < tolerance;
  if (isSept) return { type: type, js: js };

  var isDDD = Math.abs(roivs[0] - roivs[2]) < tolerance && Math.abs(roivs[0] - roivs[3]) < tolerance && Math.abs(roivs[0] - roivs[5]) < tolerance && Math.abs(roivs[1] - roivs[4]) < tolerance && Math.abs(roivs[0] - roivs[1]) >= tolerance;
  var dddJs = [oivs[0] * observeFrequency, (oivs[0] + oivs[1]) * observeFrequency, (oivs[0] + oivs[1] + oivs[2]) * observeFrequency];
  if (isDDD) return { type: 'ddd', js: dddJs };
  return { type: 'm', js: [] };
};

var verifyTypeO = function verifyTypeO(type, js, oivs, metaSt) {
  if (!passRuleIntervalCounts(oivs, 7)) return { type: 'm', js: [] };

  var _getRuleParams6 = getRuleParams(oivs, metaSt),
      roivs = _getRuleParams6.roivs,
      rsivs = _getRuleParams6.rsivs,
      tolerance = _getRuleParams6.tolerance,
      observeFrequency = _getRuleParams6.observeFrequency;

  var isO = Math.abs(rsivs[0] - rsivs[6]) < tolerance;
  if (isO) return { type: type, js: js };

  var isQD = Math.abs(roivs[0] - roivs[2]) < tolerance && Math.abs(roivs[0] - roivs[4]) < tolerance && Math.abs(roivs[0] - roivs[6]) < tolerance && Math.abs(roivs[1] - roivs[3]) < tolerance && Math.abs(roivs[1] - roivs[5]) < tolerance;
  var qdJs = [oivs[0] * observeFrequency, (oivs[0] + oivs[1]) * observeFrequency];
  if (isQD) return { type: 'qd', js: qdJs };

  var isDQ1 = Math.abs(roivs[0] - roivs[1] - roivs[2]) < tolerance && Math.abs(roivs[0] - roivs[2] - roivs[3]) < tolerance && Math.abs(roivs[0] - roivs[3] - roivs[4]) < tolerance && Math.abs(roivs[0] - roivs[4] - roivs[5]) < tolerance && Math.abs(roivs[0] - roivs[6]) < tolerance && Math.abs(roivs[1] - roivs[5]) < tolerance;
  var dq1Js = [oivs[0] * observeFrequency, (oivs[0] + oivs[1]) * observeFrequency];
  if (isDQ1) return { type: 'dq', js: dq1Js };

  var isDQ2 = Math.abs(roivs[0] - roivs[1]) < tolerance && Math.abs(roivs[0] - roivs[2]) < tolerance && Math.abs(roivs[0] - roivs[4]) < tolerance && Math.abs(roivs[0] - roivs[5]) < tolerance && Math.abs(roivs[0] - roivs[6]) < tolerance && Math.abs(roivs[0] - roivs[3]) >= tolerance;
  var dq2Js = [oivs[0] * observeFrequency, (oivs[0] + oivs[1] + oivs[2] + oivs[3]) * observeFrequency];
  if (isDQ2) return { type: 'dq', js: dq2Js };

  var isDDD1 = Math.abs(roivs[0] - roivs[2]) < tolerance && Math.abs(roivs[0] - roivs[4]) < tolerance && Math.abs(roivs[0] - roivs[6]) < tolerance && Math.abs(roivs[1] - roivs[5]) < tolerance;
  var ddd1Js = [oivs[0] * observeFrequency, (oivs[0] + oivs[1]) * observeFrequency, (oivs[0] + oivs[1] + oivs[2] + oivs[3]) * observeFrequency];
  if (isDDD1) return { type: 'ddd', js: ddd1Js };

  var isDDD2 = Math.abs(roivs[0] - roivs[2] - roivs[3]) < tolerance && Math.abs(roivs[0] - roivs[3] - roivs[4]) < tolerance && Math.abs(roivs[0] - roivs[6]) < tolerance && Math.abs(roivs[1] - roivs[5]) < tolerance && Math.abs(roivs[0] - roivs[1]) >= tolerance;
  var ddd2Js = [oivs[0] * observeFrequency, (oivs[0] + oivs[1]) * observeFrequency, (oivs[0] + oivs[1] + oivs[2]) * observeFrequency];
  if (isDDD2) return { type: 'ddd', js: ddd2Js };

  return { type: 'm', js: [] };
};

exports.verifyTypeT = verifyTypeT;
exports.verifyTypeQ = verifyTypeQ;
exports.verifyTypeQuint = verifyTypeQuint;
exports.verifyTypeH = verifyTypeH;
exports.verifyTypeSept = verifyTypeSept;
exports.verifyTypeO = verifyTypeO;
exports.verifyTypePeakCount = verifyTypePeakCount;