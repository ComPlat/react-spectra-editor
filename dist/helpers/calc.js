"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var almostEqual = function almostEqual(a, b) {
  return Math.abs(a - b) < 0.00000001 * Math.abs(a + b);
};

var calcSlope = function calcSlope(x1, y1, x2, y2) {
  return (y2 - y1) / (x2 - x1);
};

exports.almostEqual = almostEqual;
exports.calcSlope = calcSlope;