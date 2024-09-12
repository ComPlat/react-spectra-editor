"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectWavelength = exports.changeTic = void 0;
var _action_type = require("../constants/action_type");
const selectWavelength = payload => ({
  type: _action_type.HPLC_MS.UPDATE_UVVIS_WAVE_LENGTH,
  payload
});
exports.selectWavelength = selectWavelength;
const changeTic = payload => ({
  type: _action_type.HPLC_MS.SELECT_TIC_CURVE,
  payload
});
exports.changeTic = changeTic;