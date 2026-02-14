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
  },
  dscMetaData: {
    meltingPoint: null,
    tg: null
  }
};
const updateMetaData = (state, action) => {
  const {
    dscMetaData
  } = action.payload;
  return Object.assign({}, state, {
    dscMetaData
  });
};
const metaReducer = function metaReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _action_type.META.UPDATE_PEAKS_RDC:
      return Object.assign({}, state, action.payload);
    case _action_type.META.UPDATE_META_DATA_RDC:
      return updateMetaData(state, action);
    default:
      return state;
  }
};
var _default = exports.default = metaReducer;