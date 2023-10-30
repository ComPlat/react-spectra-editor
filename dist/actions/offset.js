"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sweepOffset = exports.rmOneOffset = exports.clearOffsetAll = void 0;
var _action_type = require("../constants/action_type");
const sweepOffset = payload => ({
  type: _action_type.OFFSET.SWEEP,
  payload
});
exports.sweepOffset = sweepOffset;
const clearOffsetAll = payload => ({
  type: _action_type.OFFSET.CLEAR_ALL,
  payload
});
exports.clearOffsetAll = clearOffsetAll;
const rmOneOffset = payload => ({
  type: _action_type.OFFSET.RM_ONE,
  payload
});
exports.rmOneOffset = rmOneOffset;