"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUpperThresholdValue = exports.updateThresholdValue = exports.updateLowerThresholdValue = exports.toggleThresholdIsEdit = exports.resetThresholdValue = void 0;
var _action_type = require("../constants/action_type");
const updateThresholdValue = payload => ({
  type: _action_type.THRESHOLD.UPDATE_VALUE,
  payload
});
exports.updateThresholdValue = updateThresholdValue;
const resetThresholdValue = () => ({
  type: _action_type.THRESHOLD.RESET_VALUE,
  payload: false
});
exports.resetThresholdValue = resetThresholdValue;
const toggleThresholdIsEdit = payload => ({
  type: _action_type.THRESHOLD.TOGGLE_ISEDIT,
  payload
});
exports.toggleThresholdIsEdit = toggleThresholdIsEdit;
const updateUpperThresholdValue = payload => ({
  type: _action_type.THRESHOLD.UPDATE_UPPER_VALUE,
  payload
});
exports.updateUpperThresholdValue = updateUpperThresholdValue;
const updateLowerThresholdValue = payload => ({
  type: _action_type.THRESHOLD.UPDATE_LOWER_VALUE,
  payload
});
exports.updateLowerThresholdValue = updateLowerThresholdValue;