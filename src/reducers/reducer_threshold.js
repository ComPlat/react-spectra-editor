import { THRESHOLD } from '../constants/action_type';

const initialState = false;

const thresholdReducer = (state = initialState, action) => {
  switch (action.type) {
    case THRESHOLD.UPDATE:
      return action.payload;
    case THRESHOLD.RESET:
      return initialState;
    default:
      return state;
  }
};

export default thresholdReducer;
