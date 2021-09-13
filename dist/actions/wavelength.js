"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateWaveLength = undefined;

var _action_type = require("../constants/action_type");

var updateWaveLength = function updateWaveLength(payload) {
  return {
    type: _action_type.XRD.UPDATE_WAVE_LENGTH,
    payload: payload
  };
};

exports.updateWaveLength = updateWaveLength; // eslint-disable-line