"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = {
  peaks: {
    intervalL: null,
    intervalR: null,
    observeFrequency: null,
    deltaX: null
  }
};
const metaReducer = function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _action_type.META.UPDATE_PEAKS_RDC:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
var _default = metaReducer;
exports.default = _default;