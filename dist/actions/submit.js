'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateDecimal = exports.updateOperation = exports.toggleIsIntensity = exports.toggleIsAscend = undefined;

var _action_type = require('../constants/action_type');

var toggleIsAscend = function toggleIsAscend() {
  return {
    type: _action_type.SUBMIT.TOGGLE_IS_ASCEND,
    payload: false
  };
};

var toggleIsIntensity = function toggleIsIntensity() {
  return {
    type: _action_type.SUBMIT.TOGGLE_IS_INTENSITY,
    payload: false
  };
};

var updateOperation = function updateOperation(payload) {
  return {
    type: _action_type.SUBMIT.UPDATE_OPERATION,
    payload: payload
  };
};

var updateDecimal = function updateDecimal(payload) {
  return {
    type: _action_type.SUBMIT.UPDATE_DECIMAL,
    payload: payload
  };
};

exports.toggleIsAscend = toggleIsAscend;
exports.toggleIsIntensity = toggleIsIntensity;
exports.updateOperation = updateOperation;
exports.updateDecimal = updateDecimal;