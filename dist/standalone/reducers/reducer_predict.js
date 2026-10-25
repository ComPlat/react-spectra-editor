"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable default-param-last */

const initialState = {
  outline: {},
  output: {
    result: []
  }
};
const updatePredict = (state, action) => {
  const {
    payload
  } = action;
  return {
    ...state,
    ...payload
  };
};
const predictReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.PREDICT.PREDICT_INIT:
    case _action_type.PREDICT.PREDICT_TO_WRITE_INIT:
      return {
        ...state,
        ...initialState
      };
    case _action_type.PREDICT.PREDICT_DONE:
      return {
        ...state,
        ...updatePredict(state, action)
      };
    case _action_type.PREDICT.ADD_PRED_JSON_INIT:
      return {
        ...state,
        ...action.payload
      };
    case _action_type.FILE.ADD_FAIL:
    case _action_type.FILE.CONVERT_FAIL:
    case _action_type.MOL.ADD_FAIL:
    case _action_type.MOL.CONVERT_DONE:
    case _action_type.MOL.CONVERT_FAIL:
    case _action_type.PREDICT.PREDICT_FAIL:
    case _action_type.FORM.SUBMIT:
      return {
        ...state,
        ...initialState
      };
    default:
      return state;
  }
};
var _default = exports.default = predictReducer;