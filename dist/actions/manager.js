'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetInitCommonWithIntergation = exports.resetInitMs = exports.resetInitNmr = exports.resetInitCommon = exports.resetAll = undefined;

var _action_type = require('../constants/action_type');

var resetAll = function resetAll(payload) {
  return {
    type: _action_type.MANAGER.RESETALL,
    payload: payload
  };
};

var resetInitCommon = function resetInitCommon(payload) {
  return {
    type: _action_type.MANAGER.RESET_INIT_COMMON,
    payload: payload
  };
};

var resetInitNmr = function resetInitNmr(payload) {
  return {
    type: _action_type.MANAGER.RESET_INIT_NMR,
    payload: payload
  };
};

var resetInitMs = function resetInitMs(payload) {
  return {
    type: _action_type.MANAGER.RESET_INIT_MS,
    payload: payload
  };
};

var resetInitCommonWithIntergation = function resetInitCommonWithIntergation(payload) {
  return {
    type: _action_type.MANAGER.RESET_INIT_COMMON_WITH_INTERGATION,
    payload: payload
  };
};

exports.resetAll = resetAll;
exports.resetInitCommon = resetInitCommon;
exports.resetInitNmr = resetInitNmr;
exports.resetInitMs = resetInitMs;
exports.resetInitCommonWithIntergation = resetInitCommonWithIntergation; // eslint-disable-line