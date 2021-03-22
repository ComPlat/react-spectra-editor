'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reduxUndo = require('redux-undo');

var _reduxUndo2 = _interopRequireDefault(_reduxUndo);

var _action_type = require('../constants/action_type');

var _undo_redo_config = require('./undo_redo_config');

var _calc = require('../helpers/calc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initialState = {
  prevOffset: 0,
  pos: [],
  neg: []
};

var addToPos = function addToPos(state, action) {
  var oriPosState = state.pos;
  var oriNegState = state.neg;
  var idxN = oriNegState.findIndex(function (n) {
    return (0, _calc.almostEqual)(n.x, action.payload.x);
  });
  if (idxN >= 0) {
    // rm the peak from oriNegState if it is already deleted.
    var neg = [].concat(_toConsumableArray(oriNegState.slice(0, idxN)), _toConsumableArray(oriNegState.slice(idxN + 1)));
    return Object.assign({}, state, { neg: neg });
  }
  var idxP = oriPosState.findIndex(function (p) {
    return (0, _calc.almostEqual)(p.x, action.payload.x);
  });
  if (idxP < 0) {
    // add the peak
    var pos = [].concat(_toConsumableArray(oriPosState), [action.payload]);
    return Object.assign({}, state, { pos: pos });
  }
  return state;
};

var rmFromPos = function rmFromPos(state, action) {
  var oriPosState = state.pos;
  var idx = oriPosState.findIndex(function (p) {
    return p.x === action.payload.x;
  });
  var pos = [].concat(_toConsumableArray(oriPosState.slice(0, idx)), _toConsumableArray(oriPosState.slice(idx + 1)));
  return Object.assign({}, state, { pos: pos });
};

var addToNeg = function addToNeg(state, action) {
  var oriPosState = state.pos;
  var oriNegState = state.neg;
  var idxP = oriPosState.findIndex(function (n) {
    return n.x === action.payload.x;
  });
  if (idxP >= 0) {
    var pos = [].concat(_toConsumableArray(oriPosState.slice(0, idxP)), _toConsumableArray(oriPosState.slice(idxP + 1)));
    return Object.assign({}, state, { pos: pos });
  }
  var idxN = oriNegState.findIndex(function (n) {
    return n.x === action.payload.x;
  });
  if (idxN < 0) {
    var neg = [].concat(_toConsumableArray(oriNegState), [action.payload]);
    return Object.assign({}, state, { neg: neg });
  }
  return state;
};

var rmFromNeg = function rmFromNeg(state, action) {
  var oriNegState = state.neg;
  var idx = oriNegState.findIndex(function (n) {
    return n.x === action.payload.x;
  });
  var neg = [].concat(_toConsumableArray(oriNegState.slice(0, idx)), _toConsumableArray(oriNegState.slice(idx + 1)));
  return Object.assign({}, state, { neg: neg });
};

var editPeakReducer = function editPeakReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

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
      return Object.assign({}, state, action.payload);
    case _action_type.MANAGER.RESETALL:
      return initialState;
    default:
      return _undo_redo_config.undoRedoActions.indexOf(action.type) >= 0 ? Object.assign({}, state) : state;
  }
};

var undoableEditPeakReducer = (0, _reduxUndo2.default)(editPeakReducer, _undo_redo_config.undoRedoConfig);

exports.default = undoableEditPeakReducer;