"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractPeaksEdit = exports.extractAutoPeaks = exports.extractAreaUnderCurve = void 0;
var _converter = require("./converter");
var _chem = require("./chem");
var _shift = require("./shift");
var _format = _interopRequireDefault(require("./format"));
var _integration = require("./integration");
/* eslint-disable max-len */

const niOffset = function (shiftSt) {
  let atIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  const {
    shifts
  } = shiftSt;
  const selectedShift = shifts[atIndex];
  if (!selectedShift) {
    return 0;
  }
  const {
    ref,
    peak
  } = selectedShift;
  const offset = (0, _shift.FromManualToOffset)(ref, peak);
  return offset;
};
const msOffset = () => 0;
const extractPeaksEdit = function (feature, editPeakSt, thresSt, shiftSt, layoutSt) {
  let atIndex = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  const offset = _format.default.isMsLayout(layoutSt) || _format.default.isLCMsLayout(layoutSt) ? msOffset() : niOffset(shiftSt, atIndex);
  const peaks = (0, _chem.Convert2Peak)(feature, thresSt.value, offset);
  const peaksEdit = (0, _converter.PksEdit)(peaks, editPeakSt);
  return peaksEdit;
};
exports.extractPeaksEdit = extractPeaksEdit;
const extractAutoPeaks = function (feature, thresSt, shiftSt, layoutSt) {
  let atIndex = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  const offset = _format.default.isMsLayout(layoutSt) || _format.default.isLCMsLayout(layoutSt) ? msOffset() : niOffset(shiftSt, atIndex);
  const peaks = (0, _chem.Convert2Peak)(feature, thresSt.value, offset);
  return peaks;
};
exports.extractAutoPeaks = extractAutoPeaks;
const getAUCValue = (integrationSt, layoutSt) => {
  const {
    refArea,
    refFactor,
    stack
  } = integrationSt;
  if (Array.isArray(stack) && stack.length > 0) {
    const data = stack.at(-1);
    const ignoreRef = _format.default.isHplcUvVisLayout(layoutSt);
    return (0, _integration.calcArea)(data, refArea, refFactor, ignoreRef);
  }
  return 0;
};
const extractAreaUnderCurve = (allIntegrationSt, presentIntegrationSt, layoutSt) => {
  if (_format.default.isHplcUvVisLayout(layoutSt) && Array.isArray(allIntegrationSt) && presentIntegrationSt) {
    const results = [];
    allIntegrationSt.forEach(inte => {
      const {
        integrations
      } = inte;
      const subResults = [];
      integrations.forEach(subInte => {
        const aucVal = getAUCValue(subInte, layoutSt);
        subResults.push(aucVal);
      });
      results.push(subResults);
    });
    return results;
  }
  return null;
};

// eslint-disable-line
exports.extractAreaUnderCurve = extractAreaUnderCurve;