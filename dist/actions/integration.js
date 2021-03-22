'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearIntegrationAll = exports.setIntegrationFkr = exports.sweepIntegration = undefined;

var _action_type = require('../constants/action_type');

var sweepIntegration = function sweepIntegration(payload) {
  return {
    type: _action_type.INTEGRATION.SWEEP,
    payload: payload
  };
};

var setIntegrationFkr = function setIntegrationFkr(payload) {
  return {
    type: _action_type.INTEGRATION.SET_FKR,
    payload: payload
  };
};

var clearIntegrationAll = function clearIntegrationAll(payload) {
  return {
    type: _action_type.INTEGRATION.CLEAR_ALL,
    payload: payload
  };
};

exports.sweepIntegration = sweepIntegration;
exports.setIntegrationFkr = setIntegrationFkr;
exports.clearIntegrationAll = clearIntegrationAll; // eslint-disable-line