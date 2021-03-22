'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleScanIsAuto = exports.resetScanTarget = exports.setScanTarget = undefined;

var _action_type = require('../constants/action_type');

var setScanTarget = function setScanTarget(payload) {
  return {
    type: _action_type.SCAN.SET_TARGET,
    payload: payload
  };
};

var resetScanTarget = function resetScanTarget() {
  return {
    type: _action_type.SCAN.SET_TARGET,
    payload: false
  };
};

var toggleScanIsAuto = function toggleScanIsAuto(payload) {
  return {
    type: _action_type.SCAN.TOGGLE_ISAUTO,
    payload: payload
  };
};

exports.setScanTarget = setScanTarget;
exports.resetScanTarget = resetScanTarget;
exports.toggleScanIsAuto = toggleScanIsAuto;