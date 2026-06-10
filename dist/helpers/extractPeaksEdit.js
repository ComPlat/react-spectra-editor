"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractPeaksEdit = exports.extractAutoPeaks = exports.extractAreaUnderCurve = void 0;
Object.defineProperty(exports, "formatLcmsIntegralsForBackend", {
  enumerable: true,
  get: function get() {
    return _submit.formatLcmsIntegralsForBackend;
  }
});
Object.defineProperty(exports, "formatLcmsPeaksForBackend", {
  enumerable: true,
  get: function get() {
    return _submit.formatLcmsPeaksForBackend;
  }
});
Object.defineProperty(exports, "getLcmsMzPageData", {
  enumerable: true,
  get: function get() {
    return _submit.getLcmsMzPageData;
  }
});
var _chem = require("./chem");
var _converter = require("./converter");
var _shift = require("./shift");
var _format = _interopRequireDefault(require("./format"));
var _integration = require("./integration");
var _submit = require("../features/lc-ms/submit");
/* eslint-disable max-len */

const niOffset = (shiftSt, atIndex = 0) => {
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
const extractAutoPeaks = (feature, thresSt, shiftSt, layoutSt, atIndex = 0) => {
  const offset = _format.default.isMsLayout(layoutSt) || _format.default.isLCMsLayout(layoutSt) ? msOffset() : niOffset(shiftSt, atIndex);
  const peaks = (0, _chem.Convert2Peak)(feature, thresSt.value, offset);
  return peaks;
};
exports.extractAutoPeaks = extractAutoPeaks;
const extractPeaksEdit = (feature, editPeakSt, thresSt, shiftSt, layoutSt, atIndex = 0) => {
  if (_format.default.isLCMsLayout(layoutSt)) return [];
  const peaks = extractAutoPeaks(feature, thresSt, shiftSt, layoutSt, atIndex);
  return (0, _converter.PksEdit)(peaks, editPeakSt);
};
exports.extractPeaksEdit = extractPeaksEdit;
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