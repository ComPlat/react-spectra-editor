"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCurrentPageValue = exports.selectWavelength = exports.clearIntegrationAllHplcMs = exports.clearAllPeaksHplcMs = exports.changeTic = void 0;
var _action_type = require("../constants/action_type");
const selectWavelength = payload => ({
  type: _action_type.HPLC_MS.UPDATE_UVVIS_WAVE_LENGTH,
  payload
});
exports.selectWavelength = selectWavelength;
const changeTic = payload => {
  const isNegative = payload.target.value === 1;
  const action = {
    type: _action_type.HPLC_MS.SELECT_TIC_CURVE,
    payload: {
      isNegative
    }
  };
  return action;
};
exports.changeTic = changeTic;
const updateCurrentPageValue = currentPageValue => ({
  type: _action_type.HPLC_MS.UPDATE_CURRENT_PAGE_VALUE,
  payload: {
    currentPageValue
  }
});
exports.updateCurrentPageValue = updateCurrentPageValue;
const clearIntegrationAllHplcMs = payload => ({
  type: _action_type.HPLC_MS.CLEAR_INTEGRATION_ALL_HPLCMS,
  payload
});
exports.clearIntegrationAllHplcMs = clearIntegrationAllHplcMs;
const clearAllPeaksHplcMs = payload => ({
  type: _action_type.HPLC_MS.CLEAR_ALL_PEAKS_HPLCMS,
  payload
});
exports.clearAllPeaksHplcMs = clearAllPeaksHplcMs;