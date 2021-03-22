'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMpyJ = exports.resetMpyOne = exports.clearMpyAll = exports.selectMpyType = exports.rmMpyPeakByPanel = exports.clickMpyOne = undefined;

var _action_type = require('../constants/action_type');

var clickMpyOne = function clickMpyOne(payload) {
  return {
    type: _action_type.MULTIPLICITY.ONE_CLICK,
    payload: payload
  };
};

var rmMpyPeakByPanel = function rmMpyPeakByPanel(payload) {
  return {
    type: _action_type.MULTIPLICITY.PEAK_RM_BY_PANEL,
    payload: payload
  };
};

var selectMpyType = function selectMpyType(payload) {
  return {
    type: _action_type.MULTIPLICITY.TYPE_SELECT,
    payload: payload
  };
};

var clearMpyAll = function clearMpyAll(payload) {
  return {
    type: _action_type.MULTIPLICITY.CLEAR_ALL,
    payload: payload
  };
};

var resetMpyOne = function resetMpyOne(payload) {
  return {
    type: _action_type.MULTIPLICITY.RESET_ONE,
    payload: payload
  };
};

var updateMpyJ = function updateMpyJ(payload) {
  return {
    type: _action_type.MULTIPLICITY.UPDATE_J,
    payload: payload
  };
};

exports.clickMpyOne = clickMpyOne;
exports.rmMpyPeakByPanel = rmMpyPeakByPanel;
exports.selectMpyType = selectMpyType;
exports.clearMpyAll = clearMpyAll;
exports.resetMpyOne = resetMpyOne;
exports.updateMpyJ = updateMpyJ; // eslint-disable-line