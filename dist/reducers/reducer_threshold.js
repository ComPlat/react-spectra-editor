'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _action_type = require('../constants/action_type');

var initialState = {
  isEdit: true,
  value: false
};

var thresholdReducer = function thresholdReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _action_type.THRESHOLD.UPDATE_VALUE:
      return Object.assign({}, state, { value: action.payload });
    case _action_type.THRESHOLD.RESET_VALUE:
      return Object.assign({}, state, { value: action.payload });
    case _action_type.THRESHOLD.TOGGLE_ISEDIT:
      return Object.assign({}, state, { isEdit: !state.isEdit });
    case _action_type.MANAGER.RESET_INIT_COMMON:
      return Object.assign({}, state, { isEdit: true });
    case _action_type.MANAGER.RESETALL:
      return Object.assign({}, state, { value: action.payload && action.payload.thresRef });
    default:
      return state;
  }
};

exports.default = thresholdReducer;