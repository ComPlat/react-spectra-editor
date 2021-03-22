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
  stack: [],
  refArea: 1,
  refFactor: 1,
  shift: 0,
  edited: false
};

var addToStack = function addToStack(state, action) {
  var stack = state.stack,
      refArea = state.refArea,
      shift = state.shift;
  var _action$payload = action.payload,
      xExtent = _action$payload.xExtent,
      data = _action$payload.data;
  var xL = xExtent.xL,
      xU = xExtent.xU;

  if (!xL || !xU || xU - xL === 0) {
    return state;
  }
  var area = (0, _integration.getArea)(xL, xU, data);
  var defaultRefArea = stack.length === 0 ? area : refArea;
  var newStack = [].concat(_toConsumableArray(stack), [{ xL: xL + shift, xU: xU + shift, area: area }]);
  return Object.assign({}, state, { stack: newStack, refArea: defaultRefArea });
};

var rmFromStack = function rmFromStack(state, action) {
  var stack = state.stack;
  var _action$payload2 = action.payload,
      xL = _action$payload2.xL,
      xU = _action$payload2.xU,
      xExtent = _action$payload2.xExtent;
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
  return Object.assign({}, state, { stack: newStack });
};

var setRef = function setRef(state, action) {
  var stack = state.stack;
  var _action$payload3 = action.payload,
      xL = _action$payload3.xL,
      xU = _action$payload3.xU;

  var ref = stack.filter(function (k) {
    return k.xL === xL && k.xU === xU;
  })[0];
  var refArea = ref.area;
  return Object.assign({}, state, { refArea: refArea });
};

var setFkr = function setFkr(state, action) {
  var val = parseFloat(action.payload);
  var refFactor = val < 0.01 ? 0.01 : val;
  return Object.assign({}, state, { refFactor: refFactor });
};

var setShift = function setShift(state, action) {
  var shift = action.payload.prevOffset;
  return Object.assign({}, state, { shift: shift });
};

var resetAll = function resetAll(state, action) {
  var newState = action.payload;
  return Object.assign({}, state, newState);
};

var clearAll = function clearAll() {
  return Object.assign({}, initialState, { edited: true });
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
      return clearAll();
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