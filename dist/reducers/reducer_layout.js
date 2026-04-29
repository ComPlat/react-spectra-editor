"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
var _list_layout = require("../constants/list_layout");
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = _list_layout.LIST_LAYOUT.C13;
const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.LAYOUT.UPDATE:
      return action.payload;
    case _action_type.MANAGER.RESETALL:
      return action.payload.operation.layout;
    default:
      return state;
  }
};
var _default = exports.default = layoutReducer;