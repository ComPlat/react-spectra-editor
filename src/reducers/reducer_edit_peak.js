import { EDITPEAK, MANAGER } from '../constants/action_type';
import { VirtalPts } from '../helpers/shift';

const initialState = {
  prevOffset: 0,
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

const shiftToVirtual = (state, action) => {
  const { absOffset } = action.payload;
  const { prevOffset, pos, neg } = state;
  const relOffset = prevOffset - absOffset;
  const nextPos = VirtalPts(pos, relOffset);
  const nextNeg = VirtalPts(neg, relOffset);
  return Object.assign({}, state, {
    prevOffset: absOffset,
    pos: nextPos,
    neg: nextNeg,
  });
};

/* LOGIC
                                      -no        po - tg
  | picked | another | absoffset | prevOffset | relative | newOffset
-------------------------------------------------------------------
0 |   40        20          -           -            -          0
1 |  180       160       -140           0          140        140
2 |   80        60        -40        -140         -100        100
3 |   20         0        +20        -100         -120
-------------------------------------------------------------------

*/

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
      return shiftToVirtual(state, action);
    case MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};

export default editPeakReducer;
