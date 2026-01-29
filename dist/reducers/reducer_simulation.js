"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = {
  nmrSimPeaks: []
};
const resetAll = (state, action) => {
  const newState = action.payload;
  return Object.assign({}, state, newState);
};
const simulatioinReducer = function simulatioinReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _action_type.SIMULATION.RESET_ALL_RDC:
      return resetAll(state, action);
    default:
      return state;
  }
};
var _default = exports.default = simulatioinReducer;