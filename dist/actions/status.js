'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableAllBtn = exports.toggleAllBtn = exports.toggleSubmitBtn = undefined;

var _action_type = require('../constants/action_type');

var toggleSubmitBtn = function toggleSubmitBtn() {
  return {
    type: _action_type.STATUS.TOGGLEBTNSUBMIT,
    payload: []
  };
};

var toggleAllBtn = function toggleAllBtn() {
  return {
    type: _action_type.STATUS.TOGGLEBTNALL,
    payload: []
  };
};

var enableAllBtn = function enableAllBtn() {
  return {
    type: _action_type.STATUS.ENABLEBTNALL,
    payload: []
  };
};

exports.toggleSubmitBtn = toggleSubmitBtn;
exports.toggleAllBtn = toggleAllBtn;
exports.enableAllBtn = enableAllBtn;