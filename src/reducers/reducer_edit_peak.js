/* eslint-disable prefer-object-spread, default-param-last */
import undoable from 'redux-undo';
import { EDITPEAK, MANAGER } from '../constants/action_type';

import { undoRedoConfig, undoRedoActions } from './undo_redo_config';
import { almostEqual } from '../helpers/calc';

const initialState = {
  selectedIdx: 0,
  peaks: [
    {
      prevOffset: 0,
      pos: [],
      neg: [],
    },
  ],
};

const defaultEmptyPeaks = {
  prevOffset: 0,
  pos: [],
  neg: [],
};

const addToPos = (state, action) => {
  const { peaks } = state;
  const { payload } = action;
  const { dataToAdd, curveIdx } = payload;
  let selectedEditPeaks = peaks[curveIdx];
  if (!selectedEditPeaks) {
    selectedEditPeaks = defaultEmptyPeaks;
  }

  const oriPosState = selectedEditPeaks.pos;
  const oriNegState = selectedEditPeaks.neg;
  const idxN = oriNegState.findIndex((n) => almostEqual(n.x, dataToAdd.x));
  if (idxN >= 0) { // rm the peak from oriNegState if it is already deleted.
    const neg = [
      ...oriNegState.slice(0, idxN),
      ...oriNegState.slice(idxN + 1),
    ];

    const newSelectedEditPeaks = Object.assign({}, selectedEditPeaks, { neg });
    const newPeaks = [...peaks];
    newPeaks[curveIdx] = newSelectedEditPeaks;
    return Object.assign({}, state, { peaks: newPeaks });
  }

  const idxP = oriPosState.findIndex((p) => almostEqual(p.x, dataToAdd.x));
  if (idxP < 0) { // add the peak
    const pos = [...oriPosState, dataToAdd];

    const newSelectedEditPeaks = Object.assign({}, selectedEditPeaks, { pos });
    const newPeaks = [...peaks];
    newPeaks[curveIdx] = newSelectedEditPeaks;
    return Object.assign({}, state, { peaks: newPeaks, selectedIdx: curveIdx });
  }
  return state;
};

const rmFromPos = (state, action) => {
  const { selectedIdx, peaks } = state;
  const selectedEditPeaks = peaks[selectedIdx];

  const oriPosState = selectedEditPeaks.pos;
  const idx = oriPosState.findIndex((p) => p.x === action.payload.x);
  const pos = [
    ...oriPosState.slice(0, idx),
    ...oriPosState.slice(idx + 1),
  ];

  const newSelectedEditPeaks = Object.assign({}, selectedEditPeaks, { pos });
  const newPeaks = [...peaks];
  newPeaks[selectedIdx] = newSelectedEditPeaks;
  return Object.assign({}, state, { peaks: newPeaks });
};

const addToNeg = (state, action) => {
  const { peaks } = state;
  const { payload } = action;
  const { dataToAdd, curveIdx } = payload;
  let selectedEditPeaks = peaks[curveIdx];
  if (!selectedEditPeaks) {
    selectedEditPeaks = defaultEmptyPeaks;
  }

  const oriPosState = selectedEditPeaks.pos;
  const oriNegState = selectedEditPeaks.neg;
  const idxP = oriPosState.findIndex((n) => n.x === dataToAdd.x);
  if (idxP >= 0) {
    const pos = [
      ...oriPosState.slice(0, idxP),
      ...oriPosState.slice(idxP + 1),
    ];
    const newSelectedEditPeaks = Object.assign({}, selectedEditPeaks, { pos });
    const newPeaks = [...peaks];
    newPeaks[curveIdx] = newSelectedEditPeaks;
    return Object.assign({}, state, { peaks: newPeaks });
  }
  const idxN = oriNegState.findIndex((n) => n.x === dataToAdd.x);
  if (idxN < 0) {
    const neg = [...oriNegState, dataToAdd];
    const newSelectedEditPeaks = Object.assign({}, selectedEditPeaks, { neg });
    const newPeaks = [...peaks];
    newPeaks[curveIdx] = newSelectedEditPeaks;
    return Object.assign({}, state, { peaks: newPeaks, selectedIdx: curveIdx });
  }
  return state;
};

const rmFromNeg = (state, action) => {
  const { selectedIdx, peaks } = state;
  const selectedEditPeaks = peaks[selectedIdx];

  const oriNegState = selectedEditPeaks.neg;
  const idx = oriNegState.findIndex((n) => n.x === action.payload.x);
  const neg = [
    ...oriNegState.slice(0, idx),
    ...oriNegState.slice(idx + 1),
  ];
  const newSelectedEditPeaks = Object.assign({}, selectedEditPeaks, { neg });
  const newPeaks = [...peaks];
  newPeaks[selectedIdx] = newSelectedEditPeaks;
  return Object.assign({}, state, { peaks: newPeaks });
};

const processShift = (state, action) => {
  const { payload } = action;
  const { curveIdx } = action.payload;
  const { peaks } = state;
  let selectedEditPeaks = peaks[curveIdx];
  if (!selectedEditPeaks) {
    selectedEditPeaks = defaultEmptyPeaks;
  }

  const { pos, neg, prevOffset } = payload;

  const newSelectedEditPeaks = Object.assign({}, selectedEditPeaks, { pos, neg, prevOffset });
  const newPeaks = [...peaks];
  newPeaks[curveIdx] = newSelectedEditPeaks;
  return Object.assign({}, state, { peaks: newPeaks });
};

const clearAllPeaks = (state, action) => {
  const { curveIdx, dataPeaks } = action.payload;
  const { peaks } = state;
  const selectedEditPeaks = peaks[curveIdx];

  const { pos } = selectedEditPeaks;

  const newSelectedEditPeaks = Object.assign({}, selectedEditPeaks, {
    pos: [], neg: [...pos, ...dataPeaks],
  });
  const newPeaks = [...peaks];
  newPeaks[curveIdx] = newSelectedEditPeaks;
  return Object.assign({}, state, { peaks: newPeaks });
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
      return processShift(state, action);
    case EDITPEAK.CLEAR_ALL:
      return clearAllPeaks(state, action);
    case MANAGER.RESETALL:
      return {
        selectedIdx: 0,
        peaks: [
          {
            prevOffset: 0,
            pos: [],
            neg: [],
          },
        ],
      };
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

export {
  editPeakReducer,
};

export default undoableEditPeakReducer;
