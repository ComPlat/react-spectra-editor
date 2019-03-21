import { THRESHOLD, MANAGER } from '../constants/action_type';

const initialState = {
  isEdit: true,
  value: false,
};

const thresholdReducer = (state = initialState, action) => {
  switch (action.type) {
    case THRESHOLD.UPDATE_VALUE:
      return Object.assign({}, state, { value: action.payload });
    case THRESHOLD.RESET_VALUE:
      return Object.assign({}, state, { value: action.payload });
    case THRESHOLD.TOGGLE_ISEDIT:
      return Object.assign({}, state, { isEdit: !state.isEdit });
    case MANAGER.RESETALL:
      return Object.assign(
        {},
        state,
        { value: action.payload && action.payload.thresRef },
      );
    default:
      return state;
  }
};

export default thresholdReducer;
