import { THRESHOLD } from '../constants/action_type';

const updateThreshold = payload => (
  {
    type: THRESHOLD.UPDATE,
    payload,
  }
);

const resetThreshold = () => (
  {
    type: THRESHOLD.RESET,
    payload: false,
  }
);

export { updateThreshold, resetThreshold };
