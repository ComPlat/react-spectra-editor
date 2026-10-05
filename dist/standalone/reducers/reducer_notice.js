"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable default-param-last */

const initialState = {
  status: false,
  message: false
};
const sucConversionState = {
  status: 'success',
  message: 'Conversion success!'
};
const errConversionState = {
  status: 'error',
  message: 'Conversion error!'
};
const errFileState = {
  status: 'error',
  message: 'Invalid File: accept only [.dx, .jdx, .JCAMP, .RAW, .mz(X)ML, .cdf, .zip (Bruker FID folder)], [<30MB]'
};
const errMolState = {
  status: 'error',
  message: 'Invalid File: accept only [.mol], [<30MB]'
};
const warnUnknownState = {
  status: 'warning',
  message: 'Server not available!'
};

// chem-spectra-app refuses a file it cannot process with { error } saying why (for
// example a 2D NMR file); show that rather than only the generic notice.
const withReason = (generic, prefix, action) => {
  const reason = action.payload && action.payload.error;
  return reason ? {
    status: 'error',
    message: `${prefix}: ${reason}`
  } : generic;
};
const errSaveState = {
  status: 'error',
  message: 'Save error!'
};
const buildPredictNotice = (state, action) => {
  if (!action.payload) return warnUnknownState;
  const {
    outline
  } = action.payload;
  if (!outline) return warnUnknownState;
  const {
    code,
    text
  } = outline;
  const status = code <= 299 ? 'success' : 'error';
  if (code) {
    return {
      ...state,
      status,
      message: text
    };
  }
  return warnUnknownState;
};
const noticeReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.FILE.ADD_FAIL:
      return {
        ...state,
        ...errFileState
      };
    case _action_type.MOL.ADD_FAIL:
      return {
        ...state,
        ...errMolState
      };
    case _action_type.FILE.CONVERT_DONE:
    case _action_type.MOL.CONVERT_DONE:
      return {
        ...state,
        ...sucConversionState
      };
    case _action_type.FILE.CONVERT_FAIL:
    case _action_type.MOL.CONVERT_FAIL:
      return {
        ...state,
        ...withReason(errConversionState, 'Conversion error', action)
      };
    case _action_type.FILE.SAVE_FAIL:
      return {
        ...state,
        ...withReason(errSaveState, 'Save error', action)
      };
    case _action_type.PREDICT.PREDICT_DONE:
    case _action_type.PREDICT.PREDICT_FAIL:
    case _action_type.PREDICT.ADD_PRED_JSON_INIT:
      return buildPredictNotice(state, action);
    case _action_type.NOTICE.MANUAL_CLEAR:
      return {
        ...state,
        ...initialState
      };
    default:
      return state;
  }
};
var _default = exports.default = noticeReducer;