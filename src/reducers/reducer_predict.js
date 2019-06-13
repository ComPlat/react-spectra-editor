import { PREDICT, MANAGER } from '../constants/action_type';

const initialState = {
  outline: {},
  output: { result: [] },
};

const updateIrStatus = (state, action) => {
  const { sma, identity, value } = action.payload;
  const prevFgs = state.output.result[0].fgs;
  const nextVal = { [`status${identity}`]: value };
  const nextFgs = prevFgs.map((fg) => {
    if (fg.sma === sma) {
      return Object.assign({}, fg, nextVal);
    }
    return fg;
  });
  const nextResult = { type: 'ir', fgs: nextFgs };
  return Object.assign(
    {},
    state,
    {
      output: {
        result: [nextResult],
      },
    },
  );
};

const updateNmrStatus = (state, action) => {
  const {
    idx, atom, identity, value,
  } = action.payload;
  const preResult = state.output.result[0];

  const nextShifts = preResult.shifts.map((s, index) => {
    if (s.atom === atom && index === idx) {
      return Object.assign({}, s, { [`status${identity}`]: value });
    }
    return s;
  });
  const nextResult = Object.assign(
    {},
    preResult,
    { shifts: nextShifts },
  );
  return Object.assign(
    {},
    state,
    {
      output: {
        result: [nextResult],
      },
    },
  );
};

const predictReducer = (state = initialState, action) => {
  switch (action.type) {
    case PREDICT.INIT_STATUS:
      if (!action.payload) return state;
      return Object.assign(
        {},
        action.payload,
      );
    case PREDICT.SET_IR_STATUS:
      return updateIrStatus(state, action);
    case PREDICT.SET_NMR_STATUS:
      return updateNmrStatus(state, action);
    case PREDICT.CLEAR_STATUS:
    case MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};

export default predictReducer;
