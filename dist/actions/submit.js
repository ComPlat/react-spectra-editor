"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateOperation = exports.updateDecimal = exports.toggleIsIntensity = exports.toggleIsAscend = void 0;
var _action_type = require("../constants/action_type");
const toggleIsAscend = () => ({
  type: _action_type.SUBMIT.TOGGLE_IS_ASCEND,
  payload: false
});
exports.toggleIsAscend = toggleIsAscend;
const toggleIsIntensity = () => ({
  type: _action_type.SUBMIT.TOGGLE_IS_INTENSITY,
  payload: false
});
exports.toggleIsIntensity = toggleIsIntensity;
const updateOperation = payload => ({
  type: _action_type.SUBMIT.UPDATE_OPERATION,
  payload
});
exports.updateOperation = updateOperation;
const updateDecimal = payload => ({
  type: _action_type.SUBMIT.UPDATE_DECIMAL,
  payload
});
exports.updateDecimal = updateDecimal;