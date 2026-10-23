/* eslint-disable prefer-object-spread, default-param-last */
import { FORECAST, MANAGER } from '../constants/action_type';

const initialState = {
  predictions: {
    outline: {},
    output: { result: [] },
  },
  // Predictions a host tagged with the curve they belong to (`predictions.curveIdx`),
  // keyed by that index. Empty for hosts that do not tag them.
  predictionsByCurve: {},
};

const isTaggedCurve = (state, curveIdx) => Number.isInteger(curveIdx)
  && Object.prototype.hasOwnProperty.call(state.predictionsByCurve || {}, curveIdx);

// An accept/reject edits the predictions of the curve it was made on when the host
// tagged them, and the shared predictions otherwise.
const updateStatus = (state, action, updateResl) => {
  const { predictions, curveIdx } = action.payload;
  const tagged = isTaggedCurve(state, curveIdx);
  const target = tagged ? state.predictionsByCurve[curveIdx] : state.predictions;
  const { outline, output } = target;
  const nextPredictions = {
    outline,
    output: {
      result: [updateResl(output.result[0], predictions)],
    },
  };
  if (!tagged) return Object.assign({}, state, { predictions: nextPredictions });
  return Object.assign({}, state, {
    predictionsByCurve: Object.assign(
      {},
      state.predictionsByCurve,
      { [curveIdx]: nextPredictions },
    ),
  });
};

// The host's forecast replaces the state, but predictions tagged for one curve are kept
// while the host sends another curve's.
const initStatus = (state, payload) => {
  const { predictions } = payload;
  const curveIdx = predictions && predictions.curveIdx;
  const predictionsByCurve = Number.isInteger(curveIdx)
    ? Object.assign({}, state.predictionsByCurve, { [curveIdx]: predictions })
    : (state.predictionsByCurve || {});
  return Object.assign({}, payload, { predictionsByCurve });
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

const updateIrStatus = (state, action) => updateStatus(state, action, updateIrResl);

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

const updateNmrStatus = (state, action) => updateStatus(state, action, updateNmrResl);

const forecastReducer = (state = initialState, action) => {
  switch (action.type) {
    case FORECAST.INIT_STATUS:
      if (!action.payload) return state;
      return initStatus(state, action.payload);
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
