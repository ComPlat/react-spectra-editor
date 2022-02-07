'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLowerThresholdValue = exports.updateUpperThresholdValue = exports.toggleThresholdIsEdit = exports.resetThresholdValue = exports.updateThresholdValue = undefined;

var _action_type = require('../constants/action_type');

var updateThresholdValue = function updateThresholdValue(payload) {
  return {
    type: _action_type.THRESHOLD.UPDATE_VALUE,
    payload: payload
  };
};

var resetThresholdValue = function resetThresholdValue() {
  return {
    type: _action_type.THRESHOLD.RESET_VALUE,
    payload: false
  };
};

var toggleThresholdIsEdit = function toggleThresholdIsEdit(payload) {
  return {
    type: _action_type.THRESHOLD.TOGGLE_ISEDIT,
    payload: payload
  };
};

var updateUpperThresholdValue = function updateUpperThresholdValue(payload) {
  return {
    type: _action_type.THRESHOLD.UPDATE_UPPER_VALUE,
    payload: payload
  };
};

var updateLowerThresholdValue = function updateLowerThresholdValue(payload) {
  return {
    type: _action_type.THRESHOLD.UPDATE_LOWER_VALUE,
    payload: payload
  };
};

exports.updateThresholdValue = updateThresholdValue;
exports.resetThresholdValue = resetThresholdValue;
exports.toggleThresholdIsEdit = toggleThresholdIsEdit;
exports.updateUpperThresholdValue = updateUpperThresholdValue;
exports.updateLowerThresholdValue = updateLowerThresholdValue;