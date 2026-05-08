"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.integrationReducer = exports.default = void 0;
var _reduxUndo = _interopRequireDefault(require("redux-undo"));
var _action_type = require("../constants/action_type");
var _integration = require("../helpers/integration");
var _undo_redo_config = require("./undo_redo_config");
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = {
  selectedIdx: 0,
  integrations: [{
    stack: [],
    refArea: 1,
    refFactor: 1,
    shift: 0,
    edited: false
  }]
};
const defaultEmptyIntegration = {
  stack: [],
  refArea: 1,
  refFactor: 1,
  shift: 0,
  edited: false
};
const addToStack = (state, action) => {
  const {
    newData,
    curveIdx
  } = action.payload;
  const {
    integrations
  } = state;
  let selectedIntegration = integrations[curveIdx];
  if (selectedIntegration === false || selectedIntegration === undefined) {
    selectedIntegration = defaultEmptyIntegration;
  }
  const {
    stack,
    refArea,
    shift
  } = selectedIntegration;
  const {
    xExtent,
    data
  } = newData;
  const {
    xL,
    xU
  } = xExtent;
  if (!Number.isFinite(xL) || !Number.isFinite(xU) || xU - xL === 0) {
    return state;
  }
  const area = (0, _integration.getArea)(xL, xU, data);
  const defaultRefArea = stack.length === 0 ? area : refArea;
  const absoluteArea = (0, _integration.getAbsoluteArea)(xL, xU, data); // area depends on y baseline
  const newStack = [...stack, {
    xL: xL + shift,
    xU: xU + shift,
    area,
    absoluteArea
  }];
  const newIntegration = Object.assign({}, selectedIntegration, {
    stack: newStack,
    refArea: defaultRefArea
  });
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;
  return Object.assign({}, state, {
    integrations: newArrIntegration,
    selectedIdx: curveIdx
  });
};
const rmFromStack = (state, action) => {
  const {
    dataToRemove,
    curveIdx
  } = action.payload;
  const {
    xL,
    xU,
    xExtent
  } = dataToRemove;
  const {
    integrations
  } = state;
  const selectedIntegration = integrations[curveIdx];
  const {
    stack
  } = selectedIntegration;
  let [txL, txU] = [0, 0];
  if (Number.isFinite(xL) && Number.isFinite(xU)) {
    [txL, txU] = [xL, xU];
  } else if (xExtent) {
    [txL, txU] = [xExtent.xL, xExtent.xU];
  } else {
    return state;
  }
  const newStack = stack.filter(k => k.xL !== txL && k.xU !== txU);
  const newIntegration = Object.assign({}, selectedIntegration, {
    stack: newStack
  });
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;
  return Object.assign({}, state, {
    integrations: newArrIntegration,
    selectedIdx: curveIdx
  });
};
const hasEnoughDataResolution = (xL, xU, data) => {
  const [lower, upper] = [xL, xU].sort((a, b) => a - b);
  const points = data.filter(pt => pt && Number.isFinite(pt.x) && pt.x >= lower && pt.x <= upper);
  if (points.length < 2) return false;
  return points.some(pt => pt.x !== points[0].x);
};
const buildSplitStackItem = (xL, xU, data, shift) => {
  const [lower, upper] = [xL, xU].sort((a, b) => a - b);
  const area = (0, _integration.getArea)(lower, upper, data);
  const absoluteArea = (0, _integration.getAbsoluteArea)(lower, upper, data);
  return {
    xL: lower + shift,
    xU: upper + shift,
    area,
    absoluteArea
  };
};
const splitStack = (state, action) => {
  const {
    curveIdx,
    target,
    splitX,
    data
  } = action.payload;
  if (!Number.isFinite(curveIdx) || !target || !Array.isArray(data)) {
    return state;
  }
  const {
    integrations
  } = state;
  const selectedIntegration = integrations[curveIdx];
  if (!selectedIntegration || selectedIntegration === false) {
    return state;
  }
  const {
    stack,
    shift
  } = selectedIntegration;
  const targetIndex = stack.findIndex(item => item.xL === target.xL && item.xU === target.xU);
  if (targetIndex < 0 || !Number.isFinite(splitX)) {
    return state;
  }
  const original = stack[targetIndex];
  const [xL, xU] = [original.xL - shift, original.xU - shift].sort((a, b) => a - b);
  if (!Number.isFinite(xL) || !Number.isFinite(xU) || splitX <= xL || splitX >= xU) {
    return state;
  }
  if (!hasEnoughDataResolution(xL, splitX, data) || !hasEnoughDataResolution(splitX, xU, data)) {
    return state;
  }
  const leftIntegration = buildSplitStackItem(xL, splitX, data, shift);
  const rightIntegration = buildSplitStackItem(splitX, xU, data, shift);
  const newStack = [...stack.slice(0, targetIndex), leftIntegration, rightIntegration, ...stack.slice(targetIndex + 1)];
  const newIntegration = Object.assign({}, selectedIntegration, {
    stack: newStack
  });
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;
  return Object.assign({}, state, {
    integrations: newArrIntegration,
    selectedIdx: curveIdx
  });
};
const setRef = (state, action) => {
  const {
    refData,
    curveIdx
  } = action.payload;
  const {
    integrations
  } = state;
  const selectedIntegration = integrations[curveIdx];
  const {
    stack
  } = selectedIntegration;
  const {
    xL,
    xU
  } = refData;
  const ref = stack.filter(k => k.xL === xL && k.xU === xU)[0];
  if (!ref) {
    return state;
  }
  const refArea = ref.area;
  const newIntegration = Object.assign({}, selectedIntegration, {
    refArea
  });
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;
  return Object.assign({}, state, {
    integrations: newArrIntegration,
    selectedIdx: curveIdx
  });
};
const setFkr = (state, action) => {
  const {
    payload
  } = action;
  const {
    curveIdx,
    factor
  } = payload;
  const {
    integrations
  } = state;
  const selectedIntegration = integrations[curveIdx];
  const val = parseFloat(factor);
  const refFactor = val < 0.01 ? 0.01 : val;
  const newIntegration = Object.assign({}, selectedIntegration, {
    refFactor
  });
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;
  return Object.assign({}, state, {
    integrations: newArrIntegration
  });
};
const setShift = (state, action) => {
  const {
    selectedIdx,
    integrations
  } = state;
  const selectedIntegration = integrations[selectedIdx];
  const shift = action.payload.prevOffset;
  const newIntegration = Object.assign({}, selectedIntegration, {
    shift
  });
  const newArrIntegration = [...integrations];
  newArrIntegration[selectedIdx] = newIntegration;
  return Object.assign({}, state, {
    integrations: newArrIntegration
  });
};
const resetAll = (state, action) => {
  const newState = action.payload;
  return Object.assign({}, state, newState);
};
const clearAll = (state, action) => {
  const {
    payload
  } = action;
  const {
    curveIdx
  } = payload;
  const {
    integrations
  } = state;
  const newIntegration = Object.assign({}, defaultEmptyIntegration, {
    edited: true
  });
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;
  return Object.assign({}, state, {
    integrations: newArrIntegration,
    selectedIdx: curveIdx
  });
};
const integrationReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.UI.SWEEP.SELECT_INTEGRATION:
      return addToStack(state, action);
    case _action_type.INTEGRATION.RM_ONE:
      return rmFromStack(state, action);
    case _action_type.INTEGRATION.SPLIT:
      return splitStack(state, action);
    case _action_type.INTEGRATION.SET_REF:
      return setRef(state, action);
    case _action_type.INTEGRATION.SET_FKR:
      return setFkr(state, action);
    case _action_type.INTEGRATION.RESET_ALL_RDC:
      return resetAll(state, action);
    case _action_type.INTEGRATION.CLEAR_ALL:
      return clearAll(state, action);
    case _action_type.EDITPEAK.SHIFT:
      return setShift(state, action);
    case _action_type.MANAGER.RESETALL:
      return state;
    default:
      return _undo_redo_config.undoRedoActions.indexOf(action.type) >= 0 ? Object.assign({}, state) : state;
  }
};
exports.integrationReducer = integrationReducer;
const undoableIntegrationReducer = (0, _reduxUndo.default)(integrationReducer, _undo_redo_config.undoRedoConfig);
var _default = exports.default = undoableIntegrationReducer;