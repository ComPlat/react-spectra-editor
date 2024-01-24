"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetInitNmr = exports.resetInitMs = exports.resetInitCommonWithIntergation = exports.resetInitCommon = exports.resetDetector = exports.resetAll = void 0;
var _action_type = require("../constants/action_type");
const resetAll = payload => ({
  type: _action_type.MANAGER.RESETALL,
  payload
});
exports.resetAll = resetAll;
const resetInitCommon = payload => ({
  type: _action_type.MANAGER.RESET_INIT_COMMON,
  payload
});
exports.resetInitCommon = resetInitCommon;
const resetInitNmr = payload => ({
  type: _action_type.MANAGER.RESET_INIT_NMR,
  payload
});
exports.resetInitNmr = resetInitNmr;
const resetInitMs = payload => ({
  type: _action_type.MANAGER.RESET_INIT_MS,
  payload
});
exports.resetInitMs = resetInitMs;
const resetInitCommonWithIntergation = payload => ({
  type: _action_type.MANAGER.RESET_INIT_COMMON_WITH_INTERGATION,
  payload
});
exports.resetInitCommonWithIntergation = resetInitCommonWithIntergation;
const resetDetector = () => ({
  type: _action_type.MANAGER.RESET_DETECTOR
});

// eslint-disable-line
exports.resetDetector = resetDetector;