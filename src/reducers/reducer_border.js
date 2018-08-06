import { BORDER } from '../constants/action_type';

const initialState = [];

const borderReducer = (state = initialState, action) => {
  switch (action.type) {
    case BORDER.UPDATE:
      return action.payload;
    case BORDER.RESET:
      return initialState;
    default:
      return state;
  }
};

export default borderReducer;
