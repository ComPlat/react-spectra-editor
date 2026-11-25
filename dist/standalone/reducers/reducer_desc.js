"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable default-param-last */

const initialState = '';
const descReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.DESC.UPDATE:
      return action.payload;
    case _action_type.FILE.ADD_INIT:
    case _action_type.FILE.ADD_FAIL:
    case _action_type.FILE.ADD_DONE:
    case _action_type.FILE.CONVERT_DONE:
    case _action_type.FILE.CONVERT_FAIL:
      return initialState;
    default:
      return state;
  }
};
var _default = exports.default = descReducer;