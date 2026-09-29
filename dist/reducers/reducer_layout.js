"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
var _list_layout = require("../constants/list_layout");
var _format = _interopRequireDefault(require("../helpers/format"));
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = _list_layout.LIST_LAYOUT.C13;
const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.LAYOUT.UPDATE:
      return action.payload;
    case _action_type.MANAGER.RESETALL:
      // LayerInit.execReset sets PLAIN itself on an entity change.
      return _format.default.resetAllLayout(action.payload) || state;
    default:
      return state;
  }
};
var _default = exports.default = layoutReducer;