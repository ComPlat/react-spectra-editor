"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateDetector = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable import/prefer-default-export */

const updateDetector = payload => ({
  type: _action_type.SEC.UPDATE_DETECTOR,
  payload
});
exports.updateDetector = updateDetector;