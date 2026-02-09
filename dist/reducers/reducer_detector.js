"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable no-case-declarations */
/* eslint-disable default-param-last */

const initialState = {
  curves: [{
    curveIdx: 0,
    selectedDetector: ''
  }]
};
const findCurveIndex = (curves, targetCurveIdx) => curves.findIndex(curve => curve.curveIdx === targetCurveIdx);
const updateOrAppendCurve = (curves, targetCurveIdx, newCurve) => {
  const existingCurveIndex = findCurveIndex(curves, targetCurveIdx);
  if (existingCurveIndex !== -1) {
    return curves.map((curve, index) => index === existingCurveIndex ? {
      ...curve,
      ...newCurve
    } : curve);
  }
  return [...curves, newCurve];
};
const detectorReducer = function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _action_type.SEC.UPDATE_DETECTOR:
      const {
        curveIdx,
        selectedDetector
      } = action.payload;
      // eslint-disable-next-line max-len
      const updatedCurves = updateOrAppendCurve(state.curves, curveIdx, {
        curveIdx,
        selectedDetector
      });
      return {
        ...state,
        curves: updatedCurves
      };
    case _action_type.MANAGER.RESET_DETECTOR:
      return initialState;
    default:
      return state;
  }
};
var _default = exports.default = detectorReducer;