'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxUndo = require('redux-undo');

var _reduxUndo2 = _interopRequireDefault(_reduxUndo);

var _action_type = require('../constants/action_type');

var _integration = require('../helpers/integration');

var _undo_redo_config = require('./undo_redo_config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initialState = {
  selectedIdx: 0,
  integrations: [{
    stack: [],
    refArea: 1,
    refFactor: 1,
    shift: 0,
    edited: false
  }]
};

var defaultEmptyIntegration = {
  stack: [],
  refArea: 1,
  refFactor: 1,
  shift: 0,
  edited: false
};

var addToStack = function addToStack(state, action) {
  var _action$payload = action.payload,
      newData = _action$payload.newData,
      curveIdx = _action$payload.curveIdx;
  var integrations = state.integrations;

  var selectedIntegration = integrations[curveIdx];
  if (selectedIntegration === false || selectedIntegration === undefined) {
    selectedIntegration = defaultEmptyIntegration;
  }

  var _selectedIntegration = selectedIntegration,
      stack = _selectedIntegration.stack,
      refArea = _selectedIntegration.refArea,
      shift = _selectedIntegration.shift;
  var xExtent = newData.xExtent,
      data = newData.data;
  var xL = xExtent.xL,
      xU = xExtent.xU;

  if (!xL || !xU || xU - xL === 0) {
    return state;
  }

  var area = (0, _integration.getArea)(xL, xU, data);
  var defaultRefArea = stack.length === 0 ? area : refArea;
  var absoluteArea = (0, _integration.getAbsoluteArea)(xL, xU, data); //area depends on y baseline
  var newStack = [].concat(_toConsumableArray(stack), [{ xL: xL + shift, xU: xU + shift, area: area, absoluteArea: absoluteArea }]);

  var newIntegration = Object.assign({}, selectedIntegration, { stack: newStack, refArea: defaultRefArea });
  integrations[curveIdx] = newIntegration;

  return Object.assign({}, state, { integrations: integrations, selectedIdx: curveIdx });
};

var rmFromStack = function rmFromStack(state, action) {
  var _action$payload2 = action.payload,
      dataToRemove = _action$payload2.dataToRemove,
      curveIdx = _action$payload2.curveIdx;
  var xL = dataToRemove.xL,
      xU = dataToRemove.xU,
      xExtent = dataToRemove.xExtent;
  var integrations = state.integrations;

  var selectedIntegration = integrations[curveIdx];

  var stack = selectedIntegration.stack;
  var txL = 0,
      txU = 0;

  if (xL && xU) {
    txL = xL; // rm click integration

    txU = xU;
  } else if (xExtent) {
    var _ref = [xExtent.xL, xExtent.xU]; // rm click multiplicity

    txL = _ref[0];
    txU = _ref[1];
  } else {
    return state;
  }
  var newStack = stack.filter(function (k) {
    return k.xL !== txL && k.xU !== txU;
  });

  var newIntegration = Object.assign({}, selectedIntegration, { stack: newStack });
  integrations[curveIdx] = newIntegration;

  return Object.assign({}, state, { integrations: integrations, selectedIdx: curveIdx });
};

var setRef = function setRef(state, action) {
  var _action$payload3 = action.payload,
      refData = _action$payload3.refData,
      curveIdx = _action$payload3.curveIdx;
  var integrations = state.integrations;

  var selectedIntegration = integrations[curveIdx];

  var stack = selectedIntegration.stack;
  var xL = refData.xL,
      xU = refData.xU;

  var ref = stack.filter(function (k) {
    return k.xL === xL && k.xU === xU;
  })[0];
  if (!ref) {
    return state;
  }
  var refArea = ref.area;

  var newIntegration = Object.assign({}, selectedIntegration, { refArea: refArea });
  integrations[curveIdx] = newIntegration;

  return Object.assign({}, state, { integrations: integrations, selectedIdx: curveIdx });
};

var setFkr = function setFkr(state, action) {
  var payload = action.payload;
  var curveIdx = payload.curveIdx,
      factor = payload.factor;
  var integrations = state.integrations;

  var selectedIntegration = integrations[curveIdx];

  var val = parseFloat(factor);
  var refFactor = val < 0.01 ? 0.01 : val;

  var newIntegration = Object.assign({}, selectedIntegration, { refFactor: refFactor });
  integrations[curveIdx] = newIntegration;

  return Object.assign({}, state, { integrations: integrations });
};

var setShift = function setShift(state, action) {
  var selectedIdx = state.selectedIdx,
      integrations = state.integrations;

  var selectedIntegration = integrations[selectedIdx];

  var shift = action.payload.prevOffset;

  var newIntegration = Object.assign({}, selectedIntegration, { shift: shift });
  integrations[selectedIdx] = newIntegration;

  return Object.assign({}, state, { integrations: integrations });
};

var resetAll = function resetAll(state, action) {
  var newState = action.payload;
  return Object.assign({}, state, newState);
};

var clearAll = function clearAll(state, action) {
  var payload = action.payload;
  var curveIdx = payload.curveIdx;
  var integrations = state.integrations;


  var newIntegration = Object.assign({}, defaultEmptyIntegration, { edited: true });
  integrations[curveIdx] = newIntegration;
  return Object.assign({}, state, { integrations: integrations, selectedIdx: curveIdx });
};

var integrationReducer = function integrationReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _action_type.UI.SWEEP.SELECT_INTEGRATION:
      return addToStack(state, action);
    case _action_type.INTEGRATION.RM_ONE:
      return rmFromStack(state, action);
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

var undoableIntegrationReducer = (0, _reduxUndo2.default)(integrationReducer, _undo_redo_config.undoRedoConfig);

exports.default = undoableIntegrationReducer;