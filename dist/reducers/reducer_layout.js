'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _action_type = require('../constants/action_type');

var _list_layout = require('../constants/list_layout');

var initialState = _list_layout.LIST_LAYOUT.C13;

var layoutReducer = function layoutReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _action_type.LAYOUT.UPDATE:
      return action.payload;
    case _action_type.MANAGER.RESETALL:
      return action.payload.operation.layout;
    default:
      return state;
  }
};

exports.default = layoutReducer;