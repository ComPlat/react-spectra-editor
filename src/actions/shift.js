import { SHIFT } from '../constants/action_type';

const setShiftRef = (payload) => (
  {
    type: SHIFT.SET_REF,
    payload,
  }
);

const rmShiftPeak = () => (
  {
    type: SHIFT.RM_PEAK,
    payload: null,
  }
);

export {
  setShiftRef, rmShiftPeak,
}; // eslint-disable-line
