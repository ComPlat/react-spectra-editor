import { SCAN, MANAGER } from '../constants/action_type';

const initialState = {
  target: false,
  count: 1,
};

const setTarget = (state, payload) => (
  Object.assign(
    {},
    state,
    { target: payload },
  )
);

const resetCount = (state, payload) => {
  const { scanCount } = payload;
  return Object.assign(
    {},
    state,
    { count: parseInt(scanCount, 10) },
  );
};

const scanReducer = (state = initialState, action) => {
  switch (action.type) {
    case SCAN.SET_TARGET:
    case SCAN.RESET_TARGET:
      return setTarget(state, action.payload);
    case MANAGER.RESETALL:
      return resetCount(state, action.payload);
    default:
      return state;
  }
};

export default scanReducer;
