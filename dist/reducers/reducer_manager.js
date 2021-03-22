"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// import { MANAGER } from '../constants/action_type';

var initialState = {};

var managerReducer = function managerReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    default:
      return state;
  }
};

exports.default = managerReducer;