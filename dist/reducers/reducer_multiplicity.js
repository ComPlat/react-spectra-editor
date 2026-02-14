"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reduxUndo = _interopRequireDefault(require("redux-undo"));
var _action_type = require("../constants/action_type");
var _undo_redo_config = require("./undo_redo_config");
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = {
  selectedIdx: 0,
  multiplicities: [{
    stack: [],
    shift: 0,
    smExtext: false,
    edited: false
  }]
};
const defaultEmptyMultiplicity = {
  stack: [],
  shift: 0,
  smExtext: false,
  edited: false
};
const setShift = (state, action) => {
  const shift = action.payload.prevOffset;
  const {
    selectedIdx,
    multiplicities
  } = state;
  const selectedMulti = multiplicities[selectedIdx];
  const newSelectedMulti = Object.assign({}, selectedMulti, {
    shift
  });
  const newMultiplicities = [...multiplicities];
  newMultiplicities[selectedIdx] = newSelectedMulti;
  return Object.assign({}, state, {
    multiplicities: newMultiplicities
  });
};
const rmFromStack = (state, action) => {
  const {
    dataToRemove,
    curveIdx
  } = action.payload;
  const {
    multiplicities
  } = state;
  const selectedMulti = multiplicities[curveIdx];
  const {
    stack
  } = selectedMulti;
  const {
    xL,
    xU,
    xExtent
  } = dataToRemove;
  let [txL, txU] = [0, 0];
  if (xL && xU) {
    // rm click integration
    [txL, txU] = [xL, xU];
  } else if (xExtent) {
    // rm click multiplicity
    [txL, txU] = [xExtent.xL, xExtent.xU];
  } else {
    return state;
  }
  const newStack = stack.filter(k => {
    const [kxL, kxU] = [k.xExtent.xL, k.xExtent.xU];
    return kxL !== txL && kxU !== txU;
  });
  const newSmExtext = newStack[0] ? newStack[0].xExtent : false;
  const newSelectedMulti = Object.assign({}, selectedMulti, {
    stack: newStack,
    smExtext: newSmExtext
  });
  const newMultiplicities = [...multiplicities];
  newMultiplicities[curveIdx] = newSelectedMulti;
  return Object.assign({}, state, {
    multiplicities: newMultiplicities,
    selectedIdx: curveIdx
  });
};
const updateMpyJ = (state, action) => {
  const {
    payload
  } = action;
  const {
    xExtent,
    value
  } = payload;
  if (!value && value !== '') return state;
  const {
    selectedIdx,
    multiplicities
  } = state;
  const selectedMulti = multiplicities[selectedIdx];
  const {
    stack
  } = selectedMulti;
  const regx = /[^0-9.,-]/g;
  const js = value.replace(regx, '').split(',').map(j => parseFloat(j)).filter(j => j);
  const newStack = stack.map(k => {
    if (k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU) {
      if (k.mpyType === 'm') return Object.assign({}, k, {
        js: []
      });
      return Object.assign({}, k, {
        js
      });
    }
    return k;
  });
  const newSelectedMulti = Object.assign({}, selectedMulti, {
    stack: newStack
  });
  const newMultiplicities = [...multiplicities];
  newMultiplicities[selectedIdx] = newSelectedMulti;
  return Object.assign({}, state, {
    multiplicities: newMultiplicities
  });
};
const clickMpyOne = (state, action) => {
  const {
    payload
  } = action;
  const {
    curveIdx,
    payloadData
  } = payload;
  const {
    multiplicities
  } = state;
  const selectedMulti = multiplicities[curveIdx];
  const newSelectedMulti = Object.assign({}, selectedMulti, {
    smExtext: payloadData
  });
  const newMultiplicities = [...multiplicities];
  newMultiplicities[curveIdx] = newSelectedMulti;
  return Object.assign({}, state, {
    multiplicities: newMultiplicities,
    selectedIdx: curveIdx
  });
};
const clearAll = (state, action) => {
  const {
    payload
  } = action;
  const {
    curveIdx
  } = payload;
  const {
    multiplicities
  } = state;
  const newSelectedMulti = Object.assign({}, defaultEmptyMultiplicity, {
    edited: true
  });
  const newMultiplicities = [...multiplicities];
  newMultiplicities[curveIdx] = newSelectedMulti;
  return Object.assign({}, state, {
    multiplicities: newMultiplicities
  });
};
const multiplicityReducer = function multiplicityReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _action_type.EDITPEAK.SHIFT:
      return setShift(state, action);
    case _action_type.INTEGRATION.RM_ONE:
      return rmFromStack(state, action);
    case _action_type.UI.SWEEP.SELECT_MULTIPLICITY_RDC:
    case _action_type.MULTIPLICITY.PEAK_RM_BY_PANEL_RDC:
    case _action_type.MULTIPLICITY.PEAK_RM_BY_UI_RDC:
    case _action_type.MULTIPLICITY.PEAK_ADD_BY_UI_RDC:
    case _action_type.MULTIPLICITY.RESET_ONE_RDC:
      return action.payload;
    case _action_type.MULTIPLICITY.UPDATE_J:
      return updateMpyJ(state, action);
    case _action_type.MULTIPLICITY.TYPE_SELECT_RDC:
      return action.payload;
    case _action_type.MULTIPLICITY.ONE_CLICK:
    case _action_type.MULTIPLICITY.ONE_CLICK_BY_UI:
      return clickMpyOne(state, action);
    case _action_type.MULTIPLICITY.RESET_ALL_RDC:
      return action.payload;
    case _action_type.MULTIPLICITY.CLEAR_ALL:
      return clearAll(state, action);
    case _action_type.MANAGER.RESETALL:
      return state;
    case _action_type.MANAGER.RESET_MULTIPLICITY:
      return initialState;
    default:
      return _undo_redo_config.undoRedoActions.indexOf(action.type) >= 0 ? Object.assign({}, state) : state;
  }
};
const undoableMultiplicityReducer = (0, _reduxUndo.default)(multiplicityReducer, _undo_redo_config.undoRedoConfig);
var _default = exports.default = undoableMultiplicityReducer;