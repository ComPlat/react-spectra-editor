"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable default-param-last */

const initialState = {
  src: false,
  dst: false,
  jcamp: false,
  img: false,
  jcampList: false,
  dstList: false
};
const updateConversion = (state, action) => {
  const {
    payload
  } = action;
  const {
    file,
    dst,
    jcamp,
    img,
    jcampList,
    dstList
  } = payload;
  return {
    ...state,
    src: file,
    dst,
    jcamp,
    img,
    jcampList,
    dstList
  };
};
const insertFile = (state, action) => {
  const {
    payload
  } = action;
  const {
    file
  } = payload;
  return {
    ...state,
    src: file,
    dst: false,
    jcamp: false,
    img: false,
    jcampList: false,
    dstList: false
  };
};
const fileReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.FILE.ADD_DONE:
      return insertFile(state, action);
    case _action_type.FILE.CONVERT_DONE:
      return updateConversion(state, action);
    case _action_type.FILE.ADD_FAIL:
    case _action_type.FILE.CONVERT_FAIL:
    case _action_type.MOL.ADD_FAIL:
    case _action_type.MOL.CONVERT_DONE:
    case _action_type.MOL.CONVERT_FAIL:
      return {
        ...state,
        ...initialState
      };
    default:
      return state;
  }
};
var _default = exports.default = fileReducer;