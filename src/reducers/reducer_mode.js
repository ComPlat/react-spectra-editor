import { MODE, MANAGER } from '../constants/action_type';
import { LIST_MODE } from '../constants/list_mode';

const initialState = {
  edit: LIST_MODE.RM_PEAK,
};

const resetMode = (operation) => {
  const { typ } = operation;
  switch (typ) {
    case 'NMR':
      return LIST_MODE.ANCHOR_SHIFT;
    default:
      return LIST_MODE.RM_PEAK;
  }
};

const modeReducer = (state = initialState, action) => {
  switch (action.type) {
    case MODE.SET_EDIT:
      return Object.assign({}, state, { edit: action.payload });
    case MANAGER.RESETALL:
      return Object.assign(
        {},
        initialState,
        {
          edit: resetMode(action.payload),
        },
      );
    default:
      return state;
  }
};

export default modeReducer;
