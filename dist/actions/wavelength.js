"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateWaveLength = void 0;
var _action_type = require("../constants/action_type");
const updateWaveLength = payload => ({
  type: _action_type.XRD.UPDATE_WAVE_LENGTH,
  payload
});

// eslint-disable-line
exports.updateWaveLength = updateWaveLength;