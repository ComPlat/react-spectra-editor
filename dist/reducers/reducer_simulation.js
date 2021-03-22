'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _action_type = require('../constants/action_type');

var initialState = {
  nmrSimPeaks: []
};

var resetAll = function resetAll(state, action) {
  var newState = action.payload;
  return Object.assign({}, state, newState);
};

var simulatioinReducer = function simulatioinReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _action_type.SIMULATION.RESET_ALL_RDC:
      return resetAll(state, action);
    default:
      return state;
  }
};

exports.default = simulatioinReducer;