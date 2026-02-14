"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleScanIsAuto = exports.setScanTarget = exports.resetScanTarget = void 0;
var _action_type = require("../constants/action_type");
const setScanTarget = payload => ({
  type: _action_type.SCAN.SET_TARGET,
  payload
});
exports.setScanTarget = setScanTarget;
const resetScanTarget = () => ({
  type: _action_type.SCAN.SET_TARGET,
  payload: false
});
exports.resetScanTarget = resetScanTarget;
const toggleScanIsAuto = payload => ({
  type: _action_type.SCAN.TOGGLE_ISAUTO,
  payload
});
exports.toggleScanIsAuto = toggleScanIsAuto;