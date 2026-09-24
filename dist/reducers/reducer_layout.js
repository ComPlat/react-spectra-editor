"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
var _list_layout = require("../constants/list_layout");
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = _list_layout.LIST_LAYOUT.PLAIN;
const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.LAYOUT.UPDATE:
      return action.payload;
    case _action_type.MANAGER.RESETALL:
      // A feature's operation.layout is only ever missing/falsy for a
      // malformed payload, never as an intentional "keep the current
      // layout" signal -- falling back to the possibly-stale `state` here
      // (rather than the same neutral PLAIN every other consumer falls
      // back to) is what let a child's RESETALL dispatch on an
      // unrecognized-datatype entity render one frame under whatever
      // layout the *previous* entity had, ahead of LayerInit.execReset.
      return action.payload?.operation?.layout || _list_layout.LIST_LAYOUT.PLAIN;
    default:
      return state;
  }
};
var _default = exports.default = layoutReducer;