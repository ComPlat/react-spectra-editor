"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMpyJ = exports.selectMpyType = exports.rmMpyPeakByPanel = exports.resetMpyOne = exports.clickMpyOne = exports.clearMpyAll = void 0;
var _action_type = require("../constants/action_type");
const clickMpyOne = payload => ({
  type: _action_type.MULTIPLICITY.ONE_CLICK,
  payload
});
exports.clickMpyOne = clickMpyOne;
const rmMpyPeakByPanel = payload => ({
  type: _action_type.MULTIPLICITY.PEAK_RM_BY_PANEL,
  payload
});
exports.rmMpyPeakByPanel = rmMpyPeakByPanel;
const selectMpyType = payload => ({
  type: _action_type.MULTIPLICITY.TYPE_SELECT,
  payload
});
exports.selectMpyType = selectMpyType;
const clearMpyAll = payload => ({
  type: _action_type.MULTIPLICITY.CLEAR_ALL,
  payload
});
exports.clearMpyAll = clearMpyAll;
const resetMpyOne = payload => ({
  type: _action_type.MULTIPLICITY.RESET_ONE,
  payload
});
exports.resetMpyOne = resetMpyOne;
const updateMpyJ = payload => ({
  type: _action_type.MULTIPLICITY.UPDATE_J,
  payload
});

// eslint-disable-line
exports.updateMpyJ = updateMpyJ;