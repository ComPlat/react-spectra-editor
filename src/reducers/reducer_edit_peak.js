import undoable from 'redux-undo';
import { EDITPEAK, MANAGER } from '../constants/action_type';

import { undoRedoConfig, undoRedoActions } from './undo_redo_config';
import { almostEqual } from '../helpers/calc';

const initialState = {
  prevOffset: 0,
  pos: [],
  neg: [],
};

const addToPos = (state, action) => {
  const oriPosState = state.pos;
  const oriNegState = state.neg;
  const idxN = oriNegState.findIndex(n => almostEqual(n.x, action.payload.x));
  if (idxN >= 0) { // rm the peak from oriNegState if it is already deleted.
    const neg = [
      ...oriNegState.slice(0, idxN),
      ...oriNegState.slice(idxN + 1),
    ];
    return Object.assign({}, state, { neg });
  }
  const idxP = oriPosState.findIndex(p => almostEqual(p.x, action.payload.x));
  if (idxP < 0) { // add the peak
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
    case EDITPEAK.ADD_POSITIVE:
      return addToPos(state, action);
    case EDITPEAK.ADD_NEGATIVE:
      return addToNeg(state, action);
    case EDITPEAK.RM_POSITIVE:
      return rmFromPos(state, action);
    case EDITPEAK.RM_NEGATIVE:
      return rmFromNeg(state, action);
    case EDITPEAK.SHIFT:
      return Object.assign({}, state, action.payload);
    case MANAGER.RESETALL:
      return initialState;
    default:
      return undoRedoActions.indexOf(action.type) >= 0
        ? Object.assign({}, state)
        : state;
  }
};

const undoableEditPeakReducer = undoable(
  editPeakReducer,
  undoRedoConfig,
);

export default undoableEditPeakReducer;
