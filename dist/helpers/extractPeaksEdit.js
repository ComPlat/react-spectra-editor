"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractAutoPeaks = exports.extractAreaUnderCurve = void 0;
exports.extractPeaksEdit = extractPeaksEdit;
exports.formatLcmsIntegralsForBackend = formatLcmsIntegralsForBackend;
exports.formatLcmsPeaksForBackend = formatLcmsPeaksForBackend;
var _converter = require("./converter");
var _chem = require("./chem");
var _shift = require("./shift");
var _format = _interopRequireDefault(require("./format"));
var _integration = require("./integration");
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
function formatLcmsPeaksForBackend(hplcMsSt) {
  const allPeaks = [];
  if (hplcMsSt && hplcMsSt.uvvis && hplcMsSt.uvvis.spectraList) {
    hplcMsSt.uvvis.spectraList.forEach(spectrum => {
      if (spectrum.peaks && spectrum.peaks.length > 0) {
        const {
          pageValue
        } = spectrum;
        spectrum.peaks.forEach(peak => {
          allPeaks.push({
            ...peak,
            wavelength: pageValue
          });
        });
      }
    });
  }
  return allPeaks;
}
function formatLcmsIntegralsForBackend(hplcMsSt) {
  const allIntegrals = [];
  if (hplcMsSt && hplcMsSt.uvvis && hplcMsSt.uvvis.spectraList) {
    hplcMsSt.uvvis.spectraList.forEach(spectrum => {
      if (spectrum.integrations && spectrum.integrations.length > 0) {
        const {
          pageValue
        } = spectrum;
        spectrum.integrations.forEach(integral => {
          allIntegrals.push({
            from: integral.xL,
            to: integral.xU,
            value: integral.area,
            integral: integral.absoluteArea,
            wavelength: pageValue
          });
        });
      }
    });
  }
  return allIntegrals;
}
function extractPeaksEdit(hplcMsSt) {
  if (!hplcMsSt || !hplcMsSt.uvvis || !hplcMsSt.uvvis.spectraList) return [];
  return hplcMsSt.uvvis.spectraList.flatMap(spectrum => spectrum.peaks || []);
}
const extractAutoPeaks = (feature, thresSt, shiftSt, layoutSt, atIndex = 0) => {
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