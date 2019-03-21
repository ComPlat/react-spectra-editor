import {
  STATUS, EDITPEAK, THRESHOLD, MANAGER, LAYOUT,
} from '../constants/action_type';

const initialState = {
  btnSubmit: false,
};

const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    case STATUS.TOGGLEBTNSUBMIT:
      return Object.assign(
        {},
        state,
        { btnSubmit: false }, // !state.btnSubmit
      );
    case STATUS.TOGGLEBTNALL:
      return Object.assign(
        {},
        state,
        { btnSubmit: false }, // !state.btnSubmit
      );
    case STATUS.ENABLEBTNALL:
    case EDITPEAK.ADDPOSITIVE:
    case EDITPEAK.RMPOSITIVE:
    case EDITPEAK.ADDNEGATIVE:
    case EDITPEAK.RMNEGATIVE:
    case THRESHOLD.UPDATE_VALUE:
    case THRESHOLD.RESET_VALUE:
      return Object.assign(
        {},
        state,
        { btnSubmit: false },
      );
    case LAYOUT.UPDATE:
      return Object.assign(
        {},
        state,
        { btnSubmit: false },
      );
    case MANAGER.RESETALL:
      return initialState;
    default:
      return initialState;
  }
};

export default statusReducer;
