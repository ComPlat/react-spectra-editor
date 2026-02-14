"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = {
  target: false,
  count: 1,
  isAuto: true
};
const setTarget = (state, payload) => Object.assign({}, state, {
  target: payload
});
const resetAll = (state, payload) => {
  const {
    scanCount,
    scanEditTarget
  } = payload;
  return Object.assign({}, state, {
    target: false,
    count: parseInt(scanCount, 10),
    isAuto: !scanEditTarget
  });
};
const toggleIsAuto = state => Object.assign({}, state, {
  isAuto: !state.isAuto,
  target: false
});
const scanReducer = function scanReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
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
var _default = exports.default = scanReducer;