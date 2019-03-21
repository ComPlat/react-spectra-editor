import { SCAN } from '../constants/action_type';

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

const toggleIsAuto = state => (
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
    case SCAN.RESET_ALL:
      return resetAll(state, action.payload);
    default:
      return state;
  }
};

export default scanReducer;
