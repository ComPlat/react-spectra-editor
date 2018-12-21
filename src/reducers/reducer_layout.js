import { LAYOUT, MANAGER } from '../constants/action_type';
import { LIST_LAYOUT } from '../constants/list_layout';

const initialState = LIST_LAYOUT.PLAIN;

const resetLayout = (operation) => {
  const { nucleus, typ } = operation;
  switch (typ + nucleus) {
    case 'INFRARED':
      return LIST_LAYOUT.IR;
    case 'NMR1H':
      return LIST_LAYOUT.H1;
    case 'NMR13C':
      return LIST_LAYOUT.C13;
    case 'NMR19F':
    default:
      return LIST_LAYOUT.PLAIN;
  }
};

const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case LAYOUT.UPDATE:
      return action.payload;
    case MANAGER.RESETALL:
      return resetLayout(action.payload);
    default:
      return state;
  }
};

export default layoutReducer;
