"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMetaPeaks = void 0;
var _action_type = require("../constants/action_type");
const updateMetaPeaks = payload => ({
  type: _action_type.META.UPDATE_PEAKS,
  payload
});
exports.updateMetaPeaks = updateMetaPeaks;