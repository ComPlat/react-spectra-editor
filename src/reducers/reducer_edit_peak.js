import { EDITPEAK, MANAGER } from '../constants/action_type';

const initialState = {
  pos: [],
  neg: [],
};

const addToPos = (state, action) => {
  const oriPosState = state.pos;
  const oriNegState = state.neg;
  const idxN = oriNegState.findIndex(n => n.x === action.payload.x);
  if (idxN >= 0) {
    const pos = [
      ...oriPosState.slice(0, idxN),
      ...oriPosState.slice(idxN + 1),
    ];
    return Object.assign({}, state, { pos });
  }
  const idxP = oriPosState.findIndex(p => p.x === action.payload.x);
  if (idxP < 0) {
    const pos = [...oriPosState, action.payload];
    return Object.assign({}, state, { pos });
  }
  return state;
};

const rmFromPos = (state, action) => {
  const oriPosState = state.pos;
  const idx = oriPosState.findIndex(p => p.x === action.payload.x);
  const pos = [
    ...oriPosState.slice(0, idx),
    ...oriPosState.slice(idx + 1),
  ];
  return Object.assign({}, state, { pos });
};

const addToNeg = (state, action) => {
  const oriPosState = state.pos;
  const oriNegState = state.neg;
  const idxP = oriPosState.findIndex(n => n.x === action.payload.x);
  if (idxP >= 0) {
    const pos = [
      ...oriPosState.slice(0, idxP),
      ...oriPosState.slice(idxP + 1),
    ];
    return Object.assign({}, state, { pos });
  }
  const idxN = oriNegState.findIndex(n => n.x === action.payload.x);
  if (idxN < 0) {
    const neg = [...oriNegState, action.payload];
    return Object.assign({}, state, { neg });
  }
  return state;
};

const rmFromNeg = (state, action) => {
  const oriNegState = state.neg;
  const idx = oriNegState.findIndex(n => n.x === action.payload.x);
  const neg = [
    ...oriNegState.slice(0, idx),
    ...oriNegState.slice(idx + 1),
  ];
  return Object.assign({}, state, { neg });
};

const editPeakReducer = (state = initialState, action) => {
  switch (action.type) {
    case EDITPEAK.ADDPOSITIVE:
      return addToPos(state, action);
    case EDITPEAK.RMPOSITIVE:
      return rmFromPos(state, action);
    case EDITPEAK.ADDNEGATIVE:
      return addToNeg(state, action);
    case EDITPEAK.RMNEGATIVE:
      return rmFromNeg(state, action);
    case MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};

export default editPeakReducer;
