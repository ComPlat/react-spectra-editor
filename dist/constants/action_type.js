'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var THRESHOLD = {
  UPDATE_VALUE: 'THRESHOLD_UPDATE_VALUE',
  RESET_VALUE: 'THRESHOLD_RESET_VALUE',
  TOGGLE_ISEDIT: 'THRESHOLD_TOGGLE_ISEDIT',
  UPDATE_UPPER_VALUE: 'THRESHOLD_UPDATE_UPPER_VALUE',
  UPDATE_LOWER_VALUE: 'THRESHOLD_UPDATE_LOWER_VALUE'
};

var EDITPEAK = {
  ADD_POSITIVE: 'ADD_TO_POSITIVE_EDITPEAK_LIST',
  ADD_NEGATIVE: 'ADD_TO_NEGATIVE_EDITPEAK_LIST',
  RM_NEGATIVE: 'RM_FROM_NEGATIVE_EDITPEAK_LIST',
  RM_POSITIVE: 'RM_FROM_POSITIVE_EDITPEAK_LIST',
  SHIFT: 'EDITPEAK_SHIFT'
};

var STATUS = {
  TOGGLEBTNSUBMIT: 'TOGGLE_BTN_SUBMIT',
  TOGGLEBTNALL: 'TOGGLE_BTN_ALL',
  ENABLEBTNALL: 'ENABLE_BTN_ALL'
};

var MANAGER = {
  RESETALL: 'RESET_ALL',
  RESETSHIFT: 'RESET_SHIFT',
  RESET_INIT_COMMON: 'RESET_INIT_COMMON',
  RESET_INIT_NMR: 'RESET_INIT_NMR',
  RESET_INIT_MS: 'RESET_INIT_MS',
  RESET_INIT_COMMON_WITH_INTERGATION: 'RESET_INIT_COMMON_WITH_INTERGATION'
};

var LAYOUT = {
  UPDATE: 'UPDATE_LAYOUT'
};

var SHIFT = {
  SET_REF: 'SHIFT_SET_REF',
  SET_PEAK: 'SHIFT_SET_PEAK',
  RM_PEAK: 'SHIFT_RM_PEAK'
};

var SCAN = {
  SET_TARGET: 'SCAN_SET_TARGET',
  RESET_TARGET: 'SCAN_RESET_TARGET',
  TOGGLE_ISAUTO: 'SCAN_TOGGLE_ISAUTO'
};

var UI = {
  CLICK_TARGET: 'UI_CLICK_TARGET',
  VIEWER: {
    SET_TYPE: 'UI_VIEWER_SET_TYPE'
  },
  SWEEP: {
    SET_TYPE: 'UI_SWEEP_SET_TYPE',
    SELECT: 'UI_SWEEP_SELECT',
    SELECT_ZOOMIN: 'UI_SWEEP_SELECT_ZOOMIN',
    SELECT_ZOOMRESET: 'UI_SWEEP_SELECT_ZOOMRESET',
    SELECT_INTEGRATION: 'UI_SWEEP_SELECT_INTEGRATION',
    SELECT_MULTIPLICITY: 'UI_SWEEP_SELECT_MULTIPLICITY',
    SELECT_MULTIPLICITY_RDC: 'UI_SWEEP_SELECT_MULTIPLICITY_RDC'
  },
  WHEEL: {
    SCROLL: 'UI_WHEEL_SCROLL'
  }
};

var FORECAST = {
  INIT_STATUS: 'FORECAST_INIT_STATUS',
  SET_IR_STATUS: 'FORECAST_SET_IR_STATUS',
  SET_NMR_STATUS: 'FORECAST_SET_NMR_STATUS',
  CLEAR_STATUS: 'FORECAST_CLEAR_STATUS'
};

var SUBMIT = {
  TOGGLE_IS_ASCEND: 'SUBMIT_TOGGLE_IS_ASCEND',
  TOGGLE_IS_INTENSITY: 'SUBMIT_TOGGLE_IS_INTENSITY',
  UPDATE_OPERATION: 'SUBMIT_UPDATE_OPERATION',
  UPDATE_DECIMAL: 'SUBMIT_UPDATE_DECIMAL'
};

var INTEGRATION = {
  RM_ONE: 'INTEGRATION_RM_ONE',
  SET_REF: 'INTEGRATION_SET_REF',
  SET_FKR: 'INTEGRATION_SET_FKR',
  RESET_ALL_RDC: 'INTEGRATION_RESET_ALL_RDC',
  CLEAR_ALL: 'INTEGRATION_CLEAR_ALL'
};

var SIMULATION = {
  RESET_ALL_RDC: 'SIMULATION_RESET_ALL_RDC'
};

var MULTIPLICITY = {
  ONE_CLICK: 'MULTIPLICITY_ONE_CLICK',
  ONE_CLICK_BY_UI: 'MULTIPLICITY_ONE_CLICK_BY_UI',
  PEAK_RM_BY_PANEL: 'MULTIPLICITY_PEAK_RM_BY_PANEL',
  PEAK_RM_BY_PANEL_RDC: 'MULTIPLICITY_PEAK_RM_BY_PANEL_RDC',
  PEAK_ADD_BY_UI_SAG: 'MULTIPLICITY_PEAK_ADD_BY_UI_SAG',
  PEAK_ADD_BY_UI_RDC: 'MULTIPLICITY_PEAK_ADD_BY_UI_RDC',
  PEAK_RM_BY_UI: 'MULTIPLICITY_PEAK_RM_BY_UI',
  PEAK_RM_BY_UI_RDC: 'MULTIPLICITY_PEAK_RM_BY_UI_RDC',
  TYPE_SELECT: 'MULTIPLICITY_TYPE_SELECT',
  TYPE_SELECT_RDC: 'MULTIPLICITY_TYPE_SELECT_RDC',
  RESET_ALL_RDC: 'MULTIPLICITY_RESET_ALL_RDC',
  RESET_ONE: 'MULTIPLICITY_RESET_ONE',
  RESET_ONE_RDC: 'MULTIPLICITY_RESET_ONE_RDC',
  UPDATE_J: 'MULTIPLICITY_UPDATE_J',
  CLEAR_ALL: 'MULTIPLICITY_CLEAR_ALL'
};

var META = {
  UPDATE_PEAKS: 'META_UPDATE_PEAKS',
  UPDATE_PEAKS_RDC: 'META_UPDATE_PEAKS_RDC'
};

var JCAMP = {
  ADD_OTHERS: 'JCAMP_ADD_OTHERS',
  RM_OTHERS_ONE: 'JCAMP_RM_OTHERS_ONE',
  TOGGLE_SHOW: 'JCAMP_TOGGLE_SHOW',
  CLEAR_ALL: 'JCAMP_CLEAR_ALL'
};

var XRD = {
  UPDATE_WAVE_LENGTH: 'UPDATE_WAVE_LENGTH'
};

var CYCLIC_VOLTA_METRY = {
  ADD_PAIR_PEAKS: 'ADD_PAIR_PEAKS',
  REMOVE_PAIR_PEAKS: 'REMOVE_PAIR_PEAKS',
  ADD_MAX_PEAK: 'ADD_MAX_PEAK',
  REMOVE_MAX_PEAK: 'REMOVE_MAX_PEAK',
  ADD_MIN_PEAK: 'ADD_MIN_PEAK',
  REMOVE_MIN_PEAK: 'REMOVE_MIN_PEAK',
  SELECT_PAIR_PEAK: 'SELECT_PAIR_PEAK',
  WORK_WITH_MAX_PEAK: 'WORK_WITH_MAX_PEAK',
  ADD_PECKER: 'ADD_PECKER',
  REMOVE_PECKER: 'REMOVE_PECKER',
  RESETALL: 'RESETALL_VOLTA_METRY'
};

var CURVE = {
  SELECT_WORKING_CURVE: 'SELECT_WORKING_CURVE',
  SET_ALL_CURVES: 'SET_ALL_CURVES'
};

exports.THRESHOLD = THRESHOLD;
exports.EDITPEAK = EDITPEAK;
exports.STATUS = STATUS;
exports.MANAGER = MANAGER;
exports.LAYOUT = LAYOUT;
exports.SHIFT = SHIFT;
exports.SCAN = SCAN;
exports.UI = UI;
exports.FORECAST = FORECAST;
exports.SUBMIT = SUBMIT;
exports.INTEGRATION = INTEGRATION;
exports.MULTIPLICITY = MULTIPLICITY;
exports.META = META;
exports.SIMULATION = SIMULATION;
exports.JCAMP = JCAMP;
exports.XRD = XRD;
exports.CYCLIC_VOLTA_METRY = CYCLIC_VOLTA_METRY;
exports.CURVE = CURVE;