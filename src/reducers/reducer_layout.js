import { LAYOUT } from '../constants/action_type';
import { LIST_LAYOUT } from '../constants/list_layout';

const initialState = LIST_LAYOUT.PLAIN;

const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case LAYOUT.UPDATE:
      return action.payload;
    default:
      return state;
  }
};

export default layoutReducer;
