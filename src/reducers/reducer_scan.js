/* eslint-disable prefer-object-spread, default-param-last */
import { SCAN, MANAGER } from '../constants/action_type';

const initialState = {
  target: false,
  count: 1,
  isAuto: true,
};

const setTarget = (state, payload) => (
  Object.assign(
    {},
    state,
    { target: payload },
  )
);

const resetAll = (state, payload) => {
  const { scanCount, scanEditTarget } = payload;

  return Object.assign(
    {},
    state,
    {
      target: false,
      count: parseInt(scanCount, 10),
      isAuto: !scanEditTarget,
    },
  );
};

const toggleIsAuto = (state) => (
  Object.assign(
    {},
    state,
    {
      isAuto: !state.isAuto,
      target: false,
    },
  )
);

const scanReducer = (state = initialState, action) => {
  switch (action.type) {
    case SCAN.SET_TARGET:
    case SCAN.RESET_TARGET:
      return setTarget(state, action.payload);
    case SCAN.TOGGLE_ISAUTO:
      return toggleIsAuto(state);
    case MANAGER.RESET_INIT_MS:
      return resetAll(state, action.payload);
    default:
      return state;
  }
};

export default scanReducer;
