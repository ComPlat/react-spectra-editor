import { STATUS, EDITPEAK, THRESHOLD } from '../constants/action_type';

const initialState = {
  btnSave: false,
  btnWrite: false,
};

const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    case STATUS.TOGGLEBTNSAVE:
      return Object.assign({}, state, { btnSave: !state.btnSave });
    case STATUS.TOGGLEBTNWRITE:
      return Object.assign({}, state, { btnWrite: !state.btnWrite });
    case STATUS.TOGGLEBTNALL:
      return Object.assign(
        {},
        state,
        { btnWrite: !state.btnWrite, btnSave: !state.btnSave },
      );
    case EDITPEAK.ADDPOSITIVE:
    case EDITPEAK.RMPOSITIVE:
    case EDITPEAK.ADDNEGATIVE:
    case EDITPEAK.RMNEGATIVE:
    case THRESHOLD.UPDATE:
    case THRESHOLD.RESET:
      return Object.assign(
        {},
        state,
        { btnWrite: false, btnSave: false },
      );
    default:
      return state;
  }
};

export default statusReducer;
