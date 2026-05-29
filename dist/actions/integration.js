"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sweepIntegration = exports.setIntegrationFkr = exports.clearIntegrationAll = void 0;
var _action_type = require("../constants/action_type");
const sweepIntegration = payload => ({
  type: _action_type.INTEGRATION.SWEEP,
  payload
});
exports.sweepIntegration = sweepIntegration;
const setIntegrationFkr = payload => ({
  type: _action_type.INTEGRATION.SET_FKR,
  payload
});
exports.setIntegrationFkr = setIntegrationFkr;
const clearIntegrationAll = payload => ({
  type: _action_type.INTEGRATION.CLEAR_ALL,
  payload
});

// eslint-disable-line
exports.clearIntegrationAll = clearIntegrationAll;