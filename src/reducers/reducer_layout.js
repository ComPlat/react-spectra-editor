import { LAYOUT, MANAGER } from '../constants/action_type';
import { LIST_LAYOUT } from '../constants/list_layout';

const initialState = LIST_LAYOUT.C13;

const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case LAYOUT.UPDATE:
      return action.payload;
    case MANAGER.RESETALL:
      return action.payload.operation.layout;
    default:
      return state;
  }
};

export default layoutReducer;
