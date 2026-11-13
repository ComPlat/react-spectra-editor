"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.submittedPredictions = exports.hasCurvePredictions = exports.curvePredictions = void 0;
const EMPTY_PREDICTIONS = {
  outline: {},
  output: {
    result: []
  }
};

// The predictions to show and submit for a curve. A host that tags its predictions with
// `curveIdx` gets each curve's own, and nothing for a curve it has not predicted yet; a
// host that does not tag them shows one set whichever curve is selected.
const curvePredictions = (forecastSt, curveIdx) => {
  const byCurve = forecastSt && forecastSt.predictionsByCurve || {};
  if (Object.prototype.hasOwnProperty.call(byCurve, curveIdx)) return byCurve[curveIdx];
  if (Object.keys(byCurve).length > 0) return EMPTY_PREDICTIONS;
  return forecastSt && forecastSt.predictions;
};
exports.curvePredictions = curvePredictions;
const hasCurvePredictions = forecastSt => Object.keys(forecastSt && forecastSt.predictionsByCurve || {}).length > 0;

// The predictions Submit sends with one of `curveCount` spectra. A host saves them with
// that spectrum, and untagged predictions belong to no particular one of several: send
// none then, rather than copy one spectrum's onto all of them.
exports.hasCurvePredictions = hasCurvePredictions;
const submittedPredictions = (forecastSt, curveIdx, curveCount) => {
  if (curveCount > 1 && !hasCurvePredictions(forecastSt)) return EMPTY_PREDICTIONS;
  return curvePredictions(forecastSt, curveIdx);
};
exports.submittedPredictions = submittedPredictions;