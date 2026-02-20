"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcMpyComplat = void 0;
var _multiplicity = require("./multiplicity");
const calcMpyComplat = origPeaks => {
  const peaks = origPeaks.sort((a, b) => a.x - b.x);
  const count = peaks.length;
  const itvs = (0, _multiplicity.getInterval)(peaks);
  const gitvs = (0, _multiplicity.groupInterval)(itvs);
  let type = 'm';
  let js = [];
  switch (count) {
    case 1:
      type = 's';
      js = [];
      break;
    case 2:
      if (gitvs.length === 1) {
        type = 'd';
        js = gitvs.map(g => g.c);
        break;
      }
      break;
    case 3:
      if (gitvs.length === 1) {
        type = 't';
        js = gitvs.map(g => g.c);
        break;
      }
      break;
    case 4:
      if (gitvs.length === 1) {
        type = 'q';
        js = gitvs.map(g => g.c);
        break;
      } else if (gitvs.length === 2) {
        type = 'dd';
        js = gitvs.map(g => g.c);
        break;
      }
      break;
    case 5:
      if (gitvs.length === 1) {
        type = 'quint';
        js = gitvs.map(g => g.c);
        break;
      }
      break;
    case 6:
      if (gitvs.length === 1) {
        type = 'h';
        js = gitvs.map(g => g.c);
        break;
      } else if (gitvs.length === 2) {
        type = 'dt';
        js = gitvs.map(g => g.c);
        break;
      }
      // td
      break;
    case 7:
      if (gitvs.length === 1) {
        type = 'sept';
        js = gitvs.map(g => g.c);
        break;
      } else if (gitvs.length === 3) {
        type = 'ddd';
        js = gitvs.map(g => g.c);
        break;
      }
      // td
      break;
    case 8:
      if (gitvs.length === 1) {
        type = 'o';
        js = gitvs.map(g => g.c);
        break;
      } else if (gitvs.length === 2) {
        type = 'dq';
        js = gitvs.map(g => g.c);
        break;
      } else if (gitvs.length === 3) {
        type = 'ddd';
        js = gitvs.map(g => g.c);
        break;
      }
      // td
      break;
    default:
      break;
  }
  return {
    type,
    js
  };
};
exports.calcMpyComplat = calcMpyComplat;