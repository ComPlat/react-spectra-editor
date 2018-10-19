import { THRESHOLD } from '../constants/action_type';

const updateThreshold = payload => (
  {
    type: THRESHOLD.UPDATE,
    payload,
  }
);

const resetThreshold = () => (
  {
    type: THRESHOLD.UPDATE,
    payload: [],
  }
);

export { updateThreshold, resetThreshold };
