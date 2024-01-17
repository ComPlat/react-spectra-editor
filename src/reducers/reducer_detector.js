/* eslint-disable no-case-declarations */
/* eslint-disable default-param-last */
import { SEC, MANAGER } from '../constants/action_type';

const initialState = {
  curves: [
    {
      curveIdx: 0,
      selectedDetector: '',
    },
  ],
};

const findCurveIndex = (curves, targetCurveIdx) => curves.findIndex((curve) => curve.curveIdx
=== targetCurveIdx);

const updateOrAppendCurve = (curves, targetCurveIdx, newCurve) => {
  const existingCurveIndex = findCurveIndex(curves, targetCurveIdx);

  if (existingCurveIndex !== -1) {
    return curves.map((curve, index) => (index === existingCurveIndex
      ? { ...curve, ...newCurve } : curve));
  }
  return [...curves, newCurve];
};

const detectorReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEC.UPDATE_DETECTOR:
      const { curveIdx, selectedDetector } = action.payload;
      // eslint-disable-next-line max-len
      const updatedCurves = updateOrAppendCurve(state.curves, curveIdx, { curveIdx, selectedDetector });
      return {
        ...state,
        curves: updatedCurves,
      };
    case MANAGER.RESET_DETECTOR:
      return initialState;
    default:
      return state;
  }
};

export default detectorReducer;
