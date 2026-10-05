"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/* eslint-disable default-param-last */
// import { FILE } from '../constants/action_type';

const initialState = {};
const formReducer = (state = initialState, action) => {
  switch (action.type) {
    // case FILE.ADD_INIT:
    // case FILE.ADD_FAIL:
    // case FILE.ADD_DONE:
    // case FILE.CONVERT_DONE:
    // case FILE.CONVERT_FAIL:
    //   return Object.assign({}, state, initialState);
    default:
      return state;
  }
};
var _default = exports.default = formReducer;