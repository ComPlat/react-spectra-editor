"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable default-param-last */
/* eslint-disable no-unused-vars */

const initialState = {
  others: []
};
const addOthers = ({
  jcamp
}) => ({
  others: [jcamp]
});
const jcampReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.JCAMP.ADD_OTHERS_RDC:
      return addOthers(action.payload);
    default:
      return initialState;
  }
};
var _default = exports.default = jcampReducer;