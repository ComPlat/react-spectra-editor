"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sweepIntegration = exports.splitIntegration = exports.setIntegrationFkr = exports.removeVisualSplitLine = exports.clearIntegrationAll = exports.addVisualSplitLine = void 0;
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
exports.clearIntegrationAll = clearIntegrationAll;
const splitIntegration = payload => ({
  type: _action_type.INTEGRATION.SPLIT,
  payload
});
exports.splitIntegration = splitIntegration;
const addVisualSplitLine = payload => ({
  type: _action_type.INTEGRATION.ADD_VISUAL_SPLIT,
  payload
});
exports.addVisualSplitLine = addVisualSplitLine;
const removeVisualSplitLine = payload => ({
  type: _action_type.INTEGRATION.RM_VISUAL_SPLIT,
  payload
});

// eslint-disable-line
exports.removeVisualSplitLine = removeVisualSplitLine;