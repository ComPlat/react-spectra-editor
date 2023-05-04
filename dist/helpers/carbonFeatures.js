'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.carbonFeatures = undefined;

var _multiplicity_calc = require('./multiplicity_calc');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var carbonFeatures = function carbonFeatures(peaksEdit, multiplicitySt) {
  var selectedIdx = multiplicitySt.selectedIdx,
      multiplicities = multiplicitySt.multiplicities;

  var selectedMultiplicity = multiplicities[selectedIdx];
  var stack = selectedMultiplicity.stack,
      shift = selectedMultiplicity.shift;

  var nmrMpyCenters = stack.map(function (stk) {
    return {
      x: (0, _multiplicity_calc.calcMpyCenter)(stk.peaks, shift, stk.mpyType),
      y: 0
    };
  });
  var targetIdxs = [];
  stack.forEach(function (stk) {
    // find peak idxs to be removed
    stk.peaks.forEach(function (p) {
      var targetIdx = -1;
      var minDiff = 999999999;
      peaksEdit.forEach(function (pe, idx) {
        var xDiff = Math.abs(pe.x - p.x);
        if (xDiff < minDiff) {
          targetIdx = idx;
          minDiff = xDiff;
        }
      });
      targetIdxs = [].concat(_toConsumableArray(targetIdxs), [targetIdx]);
    });
  });
  var features = [].concat(_toConsumableArray(nmrMpyCenters));
  peaksEdit.forEach(function (pe, idx) {
    if (targetIdxs.indexOf(idx) < 0) {
      features = [].concat(_toConsumableArray(features), [pe]);
    }
  });
  return features;
};

exports.carbonFeatures = carbonFeatures; // eslint-disable-line