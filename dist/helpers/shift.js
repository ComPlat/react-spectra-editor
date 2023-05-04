"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VirtalPts = exports.RealPts = exports.FromManualToOffset = exports.CalcResidualX = void 0;
var _list_shift = require("../constants/list_shift");
/* eslint-disable prefer-object-spread, default-param-last */

const shiftNone = _list_shift.LIST_SHIFT_13C[0];
const FromManualToOffset = (ref, peak) => {
  if (!peak || ref.name === shiftNone.name) return 0;
  const offset = peak.x - ref.value;
  return offset || 0;
};
exports.FromManualToOffset = FromManualToOffset;
const CalcResidualX = (origRef, origApex, nextApex) => {
  if (!nextApex) return 0.0; // nextApex = false
  if (origRef.name === shiftNone.name) return 0.0;
  const origApexX = origApex ? origApex.x : 0.0;
  const origShift = origApexX === 0.0 ? 0.0 : origRef.value; // orig shift
  const resX = origShift - origApexX;
  return resX;
};
exports.CalcResidualX = CalcResidualX;
const VirtalPts = (pts, resX) => pts.map(pt => Object.assign({
  x: pt.x + resX,
  y: pt.y
}));
exports.VirtalPts = VirtalPts;
const RealPts = (pts, resX) => pts.map(pt => Object.assign({
  x: pt.x - resX,
  y: pt.y
}));
exports.RealPts = RealPts;