"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable default-param-last */

const initialState = {
  src: false,
  smi: false,
  mass: 0,
  svg: ''
};
const updateConversion = (state, action) => {
  const {
    payload
  } = action;
  const {
    mol,
    smi,
    mass,
    svg
  } = payload;
  return {
    ...state,
    src: mol,
    smi,
    mass,
    svg: svg || ''
  };
};
const molReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.MOL.CONVERT_DONE:
      return updateConversion(state, action);
    case _action_type.MOL.ADD_FAIL:
    case _action_type.MOL.CONVERT_FAIL:
      return {
        ...state,
        ...initialState
      };
    default:
      return state;
  }
};
var _default = exports.default = molReducer;