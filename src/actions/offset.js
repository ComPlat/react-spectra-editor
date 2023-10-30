import { OFFSET } from '../constants/action_type';

const sweepOffset = (payload) => (
  {
    type: OFFSET.SWEEP,
    payload,
  }
);

const clearOffsetAll = (payload) => (
  {
    type: OFFSET.CLEAR_ALL,
    payload,
  }
);

const rmOneOffset = (payload) => (
  {
    type: OFFSET.RM_ONE,
    payload,
  }
);

export {
  sweepOffset,
  clearOffsetAll,
  rmOneOffset,
};
