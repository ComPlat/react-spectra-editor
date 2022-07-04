import { THRESHOLD, MANAGER } from '../constants/action_type';

const initialState = {
  isEdit: true,
  value: false,
  upper: false,
  lower: false,
};

const thresholdReducer = (state = initialState, action) => {
  switch (action.type) {
    case THRESHOLD.UPDATE_VALUE:
      return Object.assign({}, state, { value: action.payload });
    case THRESHOLD.UPDATE_UPPER_VALUE:
      return Object.assign({}, state, { upper: action.payload });
    case THRESHOLD.UPDATE_LOWER_VALUE:
      return Object.assign({}, state, { lower: action.payload });
    case THRESHOLD.RESET_VALUE:
      return Object.assign({}, state, { value: action.payload });
    case THRESHOLD.TOGGLE_ISEDIT:
      return Object.assign({}, state, { isEdit: !state.isEdit });
    case MANAGER.RESET_INIT_COMMON:
      return Object.assign({}, state, { isEdit: true });
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
