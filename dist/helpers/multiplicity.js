'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var mpyBasicPatterns = ['s', 'd', 't', 'q', 'quint', 'h', 'sept', 'o', 'n'];

var getInterval = function getInterval(peaks) {
  var itvs = [];
  for (var idx = 0; idx < peaks.length - 1; idx += 1) {
    var itv = Math.abs(peaks[idx + 1].x - peaks[idx].x);
    itvs = [].concat(_toConsumableArray(itvs), [itv]);
  }
  return itvs;
};

var groupInterval = function groupInterval(itvs) {
  var gitvs = [];
  itvs.forEach(function (vv) {
    var applied = false;
    gitvs.forEach(function (gv, idx) {
      if (applied) return;
      if (Math.abs((gv.c - vv) / gv.c) <= 0.03) {
        var c = (gv.c * gv.es.length + vv) / (gv.es.length + 1);
        var es = [].concat(_toConsumableArray(gv.es), [vv]);
        gitvs = [].concat(_toConsumableArray(gitvs.filter(function (v, i) {
          return i !== idx;
        })), [{ c: c, es: es }]);
        applied = true;
      }
    });
    if (!applied) {
      gitvs = [].concat(_toConsumableArray(gitvs), [{ c: vv, es: [vv] }]);
    }
  });
  return gitvs;
};

exports.mpyBasicPatterns = mpyBasicPatterns;
exports.getInterval = getInterval;
exports.groupInterval = groupInterval;