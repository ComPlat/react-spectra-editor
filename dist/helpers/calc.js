"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var almostEqual = function almostEqual(a, b) {
  return Math.abs(a - b) < 0.00000001 * Math.abs(a + b);
};

exports.almostEqual = almostEqual;