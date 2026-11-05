"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parsePredictionJson = void 0;
// A prediction JSON dropped on "(Optional) Add Prediction": the saved output of a
// prediction, with `output.result` a list. Anything else (not JSON, or JSON of another
// shape) is refused with null rather than thrown or stored.
const parsePredictionJson = str => {
  let json;
  try {
    json = JSON.parse(str);
  } catch (e) {
    return null;
  }
  const result = json && json.output && json.output.result;
  return Array.isArray(result) ? json : null;
};

// eslint-disable-line import/prefer-default-export
exports.parsePredictionJson = parsePredictionJson;