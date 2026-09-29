"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLayout = exports.setManualLayoutOverride = exports.setCurrentDataset = void 0;
var _action_type = require("../constants/action_type");
const updateLayout = payload => ({
  type: _action_type.LAYOUT.UPDATE,
  payload
});

// See reducer_layout_override.js. Kept in step with the entity execReset is
// currently normalizing, so a manual pick dispatched alongside updateLayoutAct
// (the layout dropdown's onChange) can be recorded against the right dataset.
exports.updateLayout = updateLayout;
const setCurrentDataset = payload => ({
  type: _action_type.LAYOUT.SET_CURRENT_DATASET,
  payload
});

// payload: { datasetId, layout } -- what the user picked, and for which dataset.
exports.setCurrentDataset = setCurrentDataset;
const setManualLayoutOverride = payload => ({
  type: _action_type.LAYOUT.SET_MANUAL_OVERRIDE,
  payload
});

// eslint-disable-line
exports.setManualLayoutOverride = setManualLayoutOverride;