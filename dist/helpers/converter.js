"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ToXY = function ToXY(data) {
  var length = data ? data.length : 0;
  if (length === 0) return [];
  var peaks = [];
  var i = 0;
  for (i = 0; i < length; i += 1) {
    var _data$i = data[i],
        x = _data$i.x,
        y = _data$i.y;

    peaks = [].concat(_toConsumableArray(peaks), [[x, y]]);
  }
  return peaks;
};

var IsSame = function IsSame(one, two) {
  return Math.abs((one - two) * 10000000) < 1.0;
};

var pksRmNeg = function pksRmNeg(dataPks, editPeakSt) {
  var neg = editPeakSt.neg;

  var negXs = neg.map(function (n) {
    return n.x;
  });
  var result = dataPks.map(function (p) {
    var idx = negXs.findIndex(function (nx) {
      return IsSame(nx, p.x);
    });
    return idx >= 0 ? null : p;
  }).filter(function (r) {
    return r != null;
  });
  return result;
};

var pksAddPos = function pksAddPos(dataPks, editPeakSt) {
  var pos = editPeakSt.pos;

  var posXs = pos.map(function (p) {
    return p.x;
  });
  var posPks = dataPks.map(function (p) {
    var idx = posXs.findIndex(function (px) {
      return px === p.x;
    });
    return idx >= 0 ? null : p;
  }).filter(function (r) {
    return r != null;
  });
  var result = [].concat(_toConsumableArray(posPks), _toConsumableArray(pos));
  return result;
};

var PksEdit = function PksEdit(dataPks, editPeakSt) {
  var voltammetryPeak = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (voltammetryPeak && voltammetryPeak.length > 0) {
    var modDataPks = [];
    voltammetryPeak.forEach(function (peak) {
      if (peak.max) {
        modDataPks = [].concat(_toConsumableArray(modDataPks), [peak.max]);
      }
      if (peak.min) {
        modDataPks = [].concat(_toConsumableArray(modDataPks), [peak.min]);
      }
    });
    modDataPks = modDataPks.sort(function (a, b) {
      return a.x - b.x;
    });
    return modDataPks;
  } else {
    var _modDataPks = pksAddPos(dataPks, editPeakSt);
    _modDataPks = pksRmNeg(_modDataPks, editPeakSt);
    _modDataPks = _modDataPks.sort(function (a, b) {
      return a.x - b.x;
    });
    return _modDataPks;
  }
};

var PeckersEdit = function PeckersEdit(voltammetryPeak) {
  var modDataPeckers = [];
  voltammetryPeak.forEach(function (peak) {
    if (peak.pecker) {
      modDataPeckers = [].concat(_toConsumableArray(modDataPeckers), [peak.pecker]);
    }
  });
  modDataPeckers = modDataPeckers.sort(function (a, b) {
    return a.x - b.x;
  });
  return modDataPeckers;
};

exports.ToXY = ToXY;
exports.PksEdit = PksEdit;
exports.IsSame = IsSame;
exports.PeckersEdit = PeckersEdit;