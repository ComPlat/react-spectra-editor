import { CURVE } from '../constants/action_type';

const selectCurve = (payload) => (
  {
    type: CURVE.SELECT_WORKING_CURVE,
    payload,
  }
);

const setAllCurves = (payload) => (
  {
    type: CURVE.SET_ALL_CURVES,
    payload,
  }
);

export {
  selectCurve, setAllCurves,
};
