'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _action_type = require('../constants/action_type');

var initialState = {
  peaks: {
    intervalL: null,
    intervalR: null,
    observeFrequency: null,
    deltaX: null
  }
};

var metaReducer = function metaReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _action_type.META.UPDATE_PEAKS_RDC:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

exports.default = metaReducer;