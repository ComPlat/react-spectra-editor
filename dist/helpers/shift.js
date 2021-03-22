'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RealPts = exports.VirtalPts = exports.CalcResidualX = exports.FromManualToOffset = undefined;

var _list_shift = require('../constants/list_shift');

var shiftNone = _list_shift.LIST_SHIFT_13C[0];

var FromManualToOffset = function FromManualToOffset(ref, peak) {
  if (!peak || ref.name === shiftNone.name) return 0;
  var offset = peak.x - ref.value;
  return offset || 0;
};

var CalcResidualX = function CalcResidualX(origRef, origApex, nextApex) {
  if (!nextApex) return 0.0; // nextApex = false
  if (origRef.name === shiftNone.name) return 0.0;
  var origApexX = origApex ? origApex.x : 0.0;
  var origShift = origApexX === 0.0 ? 0.0 : origRef.value; // orig shift
  var resX = origShift - origApexX;
  return resX;
};

var VirtalPts = function VirtalPts(pts, resX) {
  return pts.map(function (pt) {
    return Object.assign({
      x: pt.x + resX,
      y: pt.y
    });
  });
};

var RealPts = function RealPts(pts, resX) {
  return pts.map(function (pt) {
    return Object.assign({
      x: pt.x - resX,
      y: pt.y
    });
  });
};

exports.FromManualToOffset = FromManualToOffset;
exports.CalcResidualX = CalcResidualX;
exports.VirtalPts = VirtalPts;
exports.RealPts = RealPts;