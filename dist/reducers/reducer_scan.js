'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _action_type = require('../constants/action_type');

var initialState = {
  target: false,
  count: 1,
  isAuto: true
};

var setTarget = function setTarget(state, payload) {
  return Object.assign({}, state, { target: payload });
};

var resetAll = function resetAll(state, payload) {
  var scanCount = payload.scanCount,
      scanEditTarget = payload.scanEditTarget;


  return Object.assign({}, state, {
    target: false,
    count: parseInt(scanCount, 10),
    isAuto: !scanEditTarget
  });
};

var toggleIsAuto = function toggleIsAuto(state) {
  return Object.assign({}, state, {
    isAuto: !state.isAuto,
    target: false
  });
};

var scanReducer = function scanReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _action_type.SCAN.SET_TARGET:
    case _action_type.SCAN.RESET_TARGET:
      return setTarget(state, action.payload);
    case _action_type.SCAN.TOGGLE_ISAUTO:
      return toggleIsAuto(state);
    case _action_type.MANAGER.RESET_INIT_MS:
      return resetAll(state, action.payload);
    default:
      return state;
  }
};

exports.default = scanReducer;