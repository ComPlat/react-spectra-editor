"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editPeakReducer = exports.default = void 0;
var _reduxUndo = _interopRequireDefault(require("redux-undo"));
var _action_type = require("../constants/action_type");
var _undo_redo_config = require("./undo_redo_config");
var _calc = require("../helpers/calc");
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = {
  selectedIdx: 0,
  peaks: [{
    prevOffset: 0,
    pos: [],
    neg: []
  }]
};
const defaultEmptyPeaks = {
  prevOffset: 0,
  pos: [],
  neg: []
};
const addToPos = (state, action) => {
  const {
    peaks
  } = state;
  const {
    payload
  } = action;
  const {
    dataToAdd,
    curveIdx
  } = payload;
  let selectedEditPeaks = peaks[curveIdx];
  if (!selectedEditPeaks) {
    selectedEditPeaks = defaultEmptyPeaks;
  }
  const oriPosState = selectedEditPeaks.pos;
  const oriNegState = selectedEditPeaks.neg;
  const idxN = oriNegState.findIndex(n => (0, _calc.almostEqual)(n.x, dataToAdd.x));
  if (idxN >= 0) {
    // rm the peak from oriNegState if it is already deleted.
    const neg = [...oriNegState.slice(0, idxN), ...oriNegState.slice(idxN + 1)];
    const newSelectedEditPeaks = Object.assign({}, selectedEditPeaks, {
      neg
    });
    const newPeaks = [...peaks];
    newPeaks[curveIdx] = newSelectedEditPeaks;
    return Object.assign({}, state, {
      peaks: newPeaks
    });
  }
  const idxP = oriPosState.findIndex(p => (0, _calc.almostEqual)(p.x, dataToAdd.x));
  if (idxP < 0) {
    // add the peak
    const pos = [...oriPosState, dataToAdd];
    const newSelectedEditPeaks = Object.assign({}, selectedEditPeaks, {
      pos
    });
    const newPeaks = [...peaks];
    newPeaks[curveIdx] = newSelectedEditPeaks;
    return Object.assign({}, state, {
      peaks: newPeaks,
      selectedIdx: curveIdx
    });
  }
  return state;
};
const rmFromPos = (state, action) => {
  const {
    selectedIdx,
    peaks
  } = state;
  const selectedEditPeaks = peaks[selectedIdx];
  const oriPosState = selectedEditPeaks.pos;
  const idx = oriPosState.findIndex(p => p.x === action.payload.x);
  const pos = [...oriPosState.slice(0, idx), ...oriPosState.slice(idx + 1)];
  const newSelectedEditPeaks = Object.assign({}, selectedEditPeaks, {
    pos
  });
  const newPeaks = [...peaks];
  newPeaks[selectedIdx] = newSelectedEditPeaks;
  return Object.assign({}, state, {
    peaks: newPeaks
  });
};
const addToNeg = (state, action) => {
  const {
    peaks
  } = state;
  const {
    payload
  } = action;
  const {
    dataToAdd,
    curveIdx
  } = payload;
  let selectedEditPeaks = peaks[curveIdx];
  if (!selectedEditPeaks) {
    selectedEditPeaks = defaultEmptyPeaks;
  }
  const oriPosState = selectedEditPeaks.pos;
  const oriNegState = selectedEditPeaks.neg;
  const idxP = oriPosState.findIndex(n => n.x === dataToAdd.x);
  if (idxP >= 0) {
    const pos = [...oriPosState.slice(0, idxP), ...oriPosState.slice(idxP + 1)];
    const newSelectedEditPeaks = Object.assign({}, selectedEditPeaks, {
      pos
    });
    const newPeaks = [...peaks];
    newPeaks[curveIdx] = newSelectedEditPeaks;
    return Object.assign({}, state, {
      peaks: newPeaks
    });
  }
  const idxN = oriNegState.findIndex(n => n.x === dataToAdd.x);
  if (idxN < 0) {
    const neg = [...oriNegState, dataToAdd];
    const newSelectedEditPeaks = Object.assign({}, selectedEditPeaks, {
      neg
    });
    const newPeaks = [...peaks];
    newPeaks[curveIdx] = newSelectedEditPeaks;
    return Object.assign({}, state, {
      peaks: newPeaks,
      selectedIdx: curveIdx
    });
  }
  return state;
};
const rmFromNeg = (state, action) => {
  const {
    selectedIdx,
    peaks
  } = state;
  const selectedEditPeaks = peaks[selectedIdx];
  const oriNegState = selectedEditPeaks.neg;
  const idx = oriNegState.findIndex(n => n.x === action.payload.x);
  const neg = [...oriNegState.slice(0, idx), ...oriNegState.slice(idx + 1)];
  const newSelectedEditPeaks = Object.assign({}, selectedEditPeaks, {
    neg
  });
  const newPeaks = [...peaks];
  newPeaks[selectedIdx] = newSelectedEditPeaks;
  return Object.assign({}, state, {
    peaks: newPeaks
  });
};
const processShift = (state, action) => {
  const {
    payload
  } = action;
  const {
    curveIdx
  } = action.payload;
  const {
    peaks
  } = state;
  let selectedEditPeaks = peaks[curveIdx];
  if (!selectedEditPeaks) {
    selectedEditPeaks = defaultEmptyPeaks;
  }
  const {
    pos,
    neg,
    prevOffset
  } = payload;
  const newSelectedEditPeaks = Object.assign({}, selectedEditPeaks, {
    pos,
    neg,
    prevOffset
  });
  const newPeaks = [...peaks];
  newPeaks[curveIdx] = newSelectedEditPeaks;
  return Object.assign({}, state, {
    peaks: newPeaks
  });
};
const clearAllPeaks = (state, action) => {
  const {
    curveIdx,
    dataPeaks
  } = action.payload;
  const {
    peaks
  } = state;
  const selectedEditPeaks = peaks[curveIdx];
  const {
    pos
  } = selectedEditPeaks;
  const newSelectedEditPeaks = Object.assign({}, selectedEditPeaks, {
    pos: [],
    neg: [...pos, ...dataPeaks]
  });
  const newPeaks = [...peaks];
  newPeaks[curveIdx] = newSelectedEditPeaks;
  return Object.assign({}, state, {
    peaks: newPeaks
  });
};
const editPeakReducer = function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _action_type.EDITPEAK.ADD_POSITIVE:
      return addToPos(state, action);
    case _action_type.EDITPEAK.ADD_NEGATIVE:
      return addToNeg(state, action);
    case _action_type.EDITPEAK.RM_POSITIVE:
      return rmFromPos(state, action);
    case _action_type.EDITPEAK.RM_NEGATIVE:
      return rmFromNeg(state, action);
    case _action_type.EDITPEAK.SHIFT:
      return processShift(state, action);
    case _action_type.EDITPEAK.CLEAR_ALL:
      return clearAllPeaks(state, action);
    case _action_type.MANAGER.RESETALL:
      return {
        selectedIdx: 0,
        peaks: [{
          prevOffset: 0,
          pos: [],
          neg: []
        }]
      };
    default:
      return _undo_redo_config.undoRedoActions.indexOf(action.type) >= 0 ? Object.assign({}, state) : state;
  }
};
exports.editPeakReducer = editPeakReducer;
const undoableEditPeakReducer = (0, _reduxUndo.default)(editPeakReducer, _undo_redo_config.undoRedoConfig);
var _default = exports.default = undoableEditPeakReducer;