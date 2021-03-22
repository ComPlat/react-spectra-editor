'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcMpyComplat = undefined;

var _multiplicity = require('./multiplicity');

var calcMpyComplat = function calcMpyComplat(origPeaks) {
  var peaks = origPeaks.sort(function (a, b) {
    return a.x - b.x;
  });
  var count = peaks.length;
  var itvs = (0, _multiplicity.getInterval)(peaks);
  var gitvs = (0, _multiplicity.groupInterval)(itvs);
  var type = 'm';
  var js = [];
  switch (count) {
    case 1:
      type = 's';
      js = [];
      break;
    case 2:
      if (gitvs.length === 1) {
        type = 'd';
        js = gitvs.map(function (g) {
          return g.c;
        });
        break;
      }
      break;
    case 3:
      if (gitvs.length === 1) {
        type = 't';
        js = gitvs.map(function (g) {
          return g.c;
        });
        break;
      }
      break;
    case 4:
      if (gitvs.length === 1) {
        type = 'q';
        js = gitvs.map(function (g) {
          return g.c;
        });
        break;
      } else if (gitvs.length === 2) {
        type = 'dd';
        js = gitvs.map(function (g) {
          return g.c;
        });
        break;
      }
      break;
    case 5:
      if (gitvs.length === 1) {
        type = 'quint';
        js = gitvs.map(function (g) {
          return g.c;
        });
        break;
      }
      break;
    case 6:
      if (gitvs.length === 1) {
        type = 'h';
        js = gitvs.map(function (g) {
          return g.c;
        });
        break;
      } else if (gitvs.length === 2) {
        type = 'dt';
        js = gitvs.map(function (g) {
          return g.c;
        });
        break;
      }
      // td
      break;
    case 7:
      if (gitvs.length === 1) {
        type = 'sept';
        js = gitvs.map(function (g) {
          return g.c;
        });
        break;
      } else if (gitvs.length === 3) {
        type = 'ddd';
        js = gitvs.map(function (g) {
          return g.c;
        });
        break;
      }
      // td
      break;
    case 8:
      if (gitvs.length === 1) {
        type = 'o';
        js = gitvs.map(function (g) {
          return g.c;
        });
        break;
      } else if (gitvs.length === 2) {
        type = 'dq';
        js = gitvs.map(function (g) {
          return g.c;
        });
        break;
      } else if (gitvs.length === 3) {
        type = 'ddd';
        js = gitvs.map(function (g) {
          return g.c;
        });
        break;
      }
      // td
      break;
    default:
      break;
  }
  return { type: type, js: js };
};

exports.calcMpyComplat = calcMpyComplat;