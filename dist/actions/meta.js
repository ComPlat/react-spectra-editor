'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMetaPeaks = undefined;

var _action_type = require('../constants/action_type');

var updateMetaPeaks = function updateMetaPeaks(payload) {
  return {
    type: _action_type.META.UPDATE_PEAKS,
    payload: payload
  };
};

exports.updateMetaPeaks = updateMetaPeaks;