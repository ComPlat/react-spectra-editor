'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.undoRedoActions = exports.undoRedoConfig = undefined;

var _reduxUndo = require('redux-undo');

var _action_type = require('../constants/action_type');

var undoRedoActions = [_action_type.EDITPEAK.ADD_POSITIVE, _action_type.EDITPEAK.ADD_NEGATIVE, _action_type.EDITPEAK.RM_POSITIVE, _action_type.EDITPEAK.RM_NEGATIVE, _action_type.EDITPEAK.SHIFT, _action_type.MANAGER.RESETALL, _action_type.MANAGER.RESETSHIFT, _action_type.MANAGER.RESET_INIT_COMMON, _action_type.MANAGER.RESET_INIT_NMR, _action_type.MANAGER.RESET_INIT_MS, _action_type.UI.SWEEP.SELECT_INTEGRATION, _action_type.UI.SWEEP.SELECT_MULTIPLICITY_RDC, _action_type.INTEGRATION.RM_ONE, _action_type.INTEGRATION.SET_REF, _action_type.INTEGRATION.SET_FKR, _action_type.INTEGRATION.RESET_ALL, _action_type.INTEGRATION.CLEAR_ALL, _action_type.MULTIPLICITY.PEAK_RM_BY_PANEL_RDC, _action_type.MULTIPLICITY.PEAK_RM_BY_UI_RDC, _action_type.MULTIPLICITY.PEAK_ADD_BY_UI_RDC, _action_type.MULTIPLICITY.RESET_ONE_RDC, _action_type.MULTIPLICITY.UPDATE_J, _action_type.MULTIPLICITY.TYPE_SELECT_RDC, _action_type.MULTIPLICITY.ONE_CLICK, _action_type.MULTIPLICITY.ONE_CLICK_BY_UI, _action_type.MULTIPLICITY.RESET_ALL_RDC, _action_type.MULTIPLICITY.CLEAR_ALL];

var undoRedoConfig = {
  debug: false,
  limit: 10,
  ignoreInitialState: true,
  filter: (0, _reduxUndo.includeAction)(undoRedoActions),
  clearHistoryType: [_action_type.EDITPEAK.SHIFT, _action_type.MANAGER.RESETALL, _action_type.MANAGER.RESETSHIFT, _action_type.MANAGER.RESET_INIT_COMMON, _action_type.MANAGER.RESET_INIT_NMR, _action_type.MANAGER.RESET_INIT_MS],
  neverSkipReducer: [_action_type.EDITPEAK.SHIFT, _action_type.MANAGER.RESETALL, _action_type.MANAGER.RESETSHIFT, _action_type.MANAGER.RESET_INIT_COMMON, _action_type.MANAGER.RESET_INIT_NMR, _action_type.MANAGER.RESET_INIT_MS]
};

exports.undoRedoConfig = undoRedoConfig;
exports.undoRedoActions = undoRedoActions;