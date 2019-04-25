import { PREDICT, MANAGER } from '../constants/action_type';

const initialState = {};

const predictReducer = (state = initialState, action) => {
  switch (action.type) {
    case PREDICT.INIT_STATUS:
      if (!action.payload || !action.payload.result) return state;
      return Object.assign(
        {},
        action.payload.result[0],
      );
    case PREDICT.SET_IR_STATUS: {
      const { fg, identity, value } = action.payload;
      const prevVal = state[fg];
      const buffVal = { [`status${identity}`]: value };
      const nextVal = Object.assign({}, prevVal, buffVal);
      return Object.assign(
        {},
        state,
        { [fg]: nextVal },
      );
    }
    case PREDICT.SET_NMR_STATUS: {
      const { atom, identity, value } = action.payload;
      const { shifts } = state;
      const nextShifts = shifts.map((s) => {
        if (s.atom === atom) {
          return Object.assign({}, s, { [`status${identity}`]: value });
        }
        return s;
      });
      return Object.assign(
        {},
        state,
        { shifts: nextShifts },
      );
    }
    case PREDICT.CLEAR_STATUS:
    case MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};

export default predictReducer;
