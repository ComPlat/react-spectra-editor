"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/* eslint-disable prefer-object-spread, default-param-last */
// import { MANAGER } from '../constants/action_type';

const initialState = {};
const managerReducer = function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    default:
      return state;
  }
};
var _default = exports.default = managerReducer;