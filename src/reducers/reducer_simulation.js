/* eslint-disable prefer-object-spread, default-param-last */
import {
  SIMULATION,
} from '../constants/action_type';

const initialState = {
  nmrSimPeaks: [],
};

const resetAll = (state, action) => {
  const newState = action.payload;
  return Object.assign({}, state, newState);
};

const simulatioinReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIMULATION.RESET_ALL_RDC:
      return resetAll(state, action);
    default:
      return state;
  }
};

export default simulatioinReducer;
