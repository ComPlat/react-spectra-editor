"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleSubmitBtn = exports.toggleAllBtn = exports.enableAllBtn = void 0;
var _action_type = require("../constants/action_type");
const toggleSubmitBtn = () => ({
  type: _action_type.STATUS.TOGGLEBTNSUBMIT,
  payload: []
});
exports.toggleSubmitBtn = toggleSubmitBtn;
const toggleAllBtn = () => ({
  type: _action_type.STATUS.TOGGLEBTNALL,
  payload: []
});
exports.toggleAllBtn = toggleAllBtn;
const enableAllBtn = () => ({
  type: _action_type.STATUS.ENABLEBTNALL,
  payload: []
});
exports.enableAllBtn = enableAllBtn;