"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = {
  isEdit: true,
  value: false,
  upper: false,
  lower: false
};
const thresholdReducer = function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _action_type.THRESHOLD.UPDATE_VALUE:
      return Object.assign({}, state, {
        value: action.payload
      });
    case _action_type.THRESHOLD.UPDATE_UPPER_VALUE:
      return Object.assign({}, state, {
        upper: action.payload
      });
    case _action_type.THRESHOLD.UPDATE_LOWER_VALUE:
      return Object.assign({}, state, {
        lower: action.payload
      });
    case _action_type.THRESHOLD.RESET_VALUE:
      return Object.assign({}, state, {
        value: action.payload
      });
    case _action_type.THRESHOLD.TOGGLE_ISEDIT:
      return Object.assign({}, state, {
        isEdit: !state.isEdit
      });
    case _action_type.MANAGER.RESET_INIT_COMMON:
      return Object.assign({}, state, {
        isEdit: true
      });
    case _action_type.MANAGER.RESETALL:
      return Object.assign({}, state, {
        value: action.payload && action.payload.thresRef
      });
    default:
      return state;
  }
};
var _default = thresholdReducer;
exports.default = _default;