import { SCAN } from '../constants/action_type';

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

const resetAll = (state, payload) => {
  const { scanCount } = payload;

  return Object.assign(
    {},
    state,
    {
      target: false,
      count: parseInt(scanCount, 10),
    },
  );
};

const scanReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case SCAN.SET_TARGET:
    case SCAN.RESET_TARGET:
      return setTarget(state, action.payload);
    case SCAN.RESET_ALL:
      return resetAll(state, action.payload);
    default:
      return state;
  }
};

export default scanReducer;
