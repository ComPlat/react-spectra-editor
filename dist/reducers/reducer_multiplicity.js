'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxUndo = require('redux-undo');

var _reduxUndo2 = _interopRequireDefault(_reduxUndo);

var _action_type = require('../constants/action_type');

var _undo_redo_config = require('./undo_redo_config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {
  stack: [],
  shift: 0,
  smExtext: false,
  edited: false
};

var setShift = function setShift(state, action) {
  var shift = action.payload.prevOffset;
  return Object.assign({}, state, { shift: shift });
};

var rmFromStack = function rmFromStack(state, action) {
  var stack = state.stack;
  var _action$payload = action.payload,
      xL = _action$payload.xL,
      xU = _action$payload.xU,
      xExtent = _action$payload.xExtent;
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
    var _ref2 = [k.xExtent.xL, k.xExtent.xU],
        kxL = _ref2[0],
        kxU = _ref2[1];

    return kxL !== txL && kxU !== txU;
  });
  var newSmExtext = newStack[0] ? newStack[0].xExtent : false;
  return Object.assign({}, state, { stack: newStack, smExtext: newSmExtext });
};

var updateMpyJ = function updateMpyJ(state, action) {
  var payload = action.payload;
  var xExtent = payload.xExtent,
      value = payload.value;

  if (!value && value !== '') return state;
  var stack = state.stack;

  var regx = /[^0-9.,-]/g;
  var js = value.replace(regx, '').split(',').map(function (j) {
    return parseFloat(j);
  }).filter(function (j) {
    return j;
  });

  var newStack = stack.map(function (k) {
    if (k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU) {
      if (k.mpyType === 'm') return Object.assign({}, k, { js: [] });
      return Object.assign({}, k, { js: js });
    }
    return k;
  });
  return Object.assign({}, state, { stack: newStack });
};

var clickMpyOne = function clickMpyOne(state, action) {
  var payload = action.payload;

  return Object.assign({}, state, { smExtext: payload });
};

var clearAll = function clearAll() {
  return Object.assign({}, initialState, { edited: true });
};

var multiplicityReducer = function multiplicityReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

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
      return clearAll();
    case _action_type.MANAGER.RESETALL:
      return state;
    default:
      return _undo_redo_config.undoRedoActions.indexOf(action.type) >= 0 ? Object.assign({}, state) : state;
  }
};

var undoableMultiplicityReducer = (0, _reduxUndo2.default)(multiplicityReducer, _undo_redo_config.undoRedoConfig);

exports.default = undoableMultiplicityReducer;