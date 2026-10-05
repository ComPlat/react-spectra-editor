"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable default-param-last */

const initialState = false;
const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.FILE.ADD_INIT:
    case _action_type.FILE.SAVE_INIT:
    case _action_type.MOL.ADD_INIT:
    case _action_type.PREDICT.PREDICT_INIT:
    case _action_type.PREDICT.PREDICT_TO_WRITE_INIT:
    case _action_type.FORM.SUBMIT:
    case _action_type.JCAMP.ADD_OTHERS_INIT:
      return true;
    case _action_type.FILE.ADD_DONE:
    case _action_type.FILE.ADD_FAIL:
    case _action_type.FILE.CONVERT_DONE:
    case _action_type.FILE.CONVERT_FAIL:
    case _action_type.FILE.SAVE_DONE:
    case _action_type.MOL.CONVERT_DONE:
    case _action_type.MOL.CONVERT_FAIL:
    case _action_type.MOL.ADD_FAIL:
    case _action_type.PREDICT.PREDICT_DONE:
    case _action_type.PREDICT.PREDICT_FAIL:
    case _action_type.JCAMP.ADD_OTHERS_RDC:
      return false;
    default:
      return state;
  }
};
var _default = exports.default = loadingReducer;