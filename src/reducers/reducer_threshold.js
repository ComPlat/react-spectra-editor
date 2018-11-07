import { THRESHOLD, MANAGER } from '../constants/action_type';

const initialState = false;

const thresholdReducer = (state = initialState, action) => {
  switch (action.type) {
    case THRESHOLD.UPDATE:
      return action.payload;
    case THRESHOLD.RESET:
      return action.payload;
    case MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};

export default thresholdReducer;
