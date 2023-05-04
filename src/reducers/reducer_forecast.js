/* eslint-disable prefer-object-spread, default-param-last */
import { FORECAST, MANAGER } from '../constants/action_type';

const initialState = {
  predictions: {
    outline: {},
    output: { result: [] },
  },
};

const updateIrResl = (stResl, plPred) => {
  const { sma, identity, value } = plPred;
  const { svgs } = stResl;
  const prevFgs = stResl.fgs;
  const nextVal = { [`status${identity}`]: value };
  const nextFgs = prevFgs.map((fg) => {
    if (fg.sma === sma) {
      return Object.assign({}, fg, nextVal);
    }
    return fg;
  });
  const nextResult = { type: 'ir', fgs: nextFgs, svgs };
  return nextResult;
};

const updateIrStatus = (state, action) => {
  const { predictions } = action.payload;
  const { outline, output } = state.predictions;
  const stResl = output.result[0];
  const nextResl = updateIrResl(stResl, predictions);

  return Object.assign(
    {},
    state,
    {
      predictions: {
        outline,
        output: {
          result: [nextResl],
        },
      },
    },
  );
};

const updateNmrResl = (stResl, plPred) => {
  const {
    idx, atom, identity, value,
  } = plPred;
  const preResult = stResl;

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
  return nextResult;
};

const updateNmrStatus = (state, action) => {
  const { predictions } = action.payload;
  const { outline, output } = state.predictions;
  const stResl = output.result[0];
  const nextResl = updateNmrResl(stResl, predictions);

  const newSt = Object.assign(
    {},
    state,
    {
      predictions: {
        outline,
        output: {
          result: [nextResl],
        },
      },
    },
  );
  return newSt;
};

const forecastReducer = (state = initialState, action) => {
  switch (action.type) {
    case FORECAST.INIT_STATUS:
      if (!action.payload) return state;
      return Object.assign(
        {},
        action.payload,
      );
    case FORECAST.SET_IR_STATUS:
      return updateIrStatus(state, action);
    case FORECAST.SET_NMR_STATUS:
      return updateNmrStatus(state, action);
    case FORECAST.CLEAR_STATUS:
    case MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};

export default forecastReducer;
