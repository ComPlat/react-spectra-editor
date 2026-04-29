"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcSlope = exports.almostEqual = void 0;
const almostEqual = (a, b) => Math.abs(a - b) < 0.00000001 * Math.abs(a + b);
exports.almostEqual = almostEqual;
const calcSlope = (x1, y1, x2, y2) => {
  if (x2 === x1) {
    return 0;
  }
  return (y2 - y1) / (x2 - x1);
};
exports.calcSlope = calcSlope;