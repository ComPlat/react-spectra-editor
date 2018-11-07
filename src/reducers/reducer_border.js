import { BORDER, MANAGER } from '../constants/action_type';

const initialState = [];

const borderReducer = (state = initialState, action) => {
  switch (action.type) {
    case BORDER.UPDATE:
      return action.payload;
    case BORDER.RESET:
    case MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};

export default borderReducer;
