import { DESC, FILE } from '../constants/action_type';

const initialState = '';

const descReducer = (state = initialState, action) => {
  switch (action.type) {
    case DESC.UPDATE:
      return action.payload;
    case FILE.ADD_INIT:
    case FILE.ADD_FAIL:
    case FILE.ADD_DONE:
    case FILE.CONVERT_DONE:
    case FILE.CONVERT_FAIL:
      return initialState;
    default:
      return state;
  }
};

export default descReducer;
