"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCurrentPageValue = exports.selectWavelength = exports.clearIntegrationAllHplcMs = exports.clearAllPeaksHplcMs = exports.changeTic = void 0;
var _action_type = require("../constants/action_type");
const normalizeTicPolarity = value => {
  if (value === 0 || value === '0') return 'positive';
  if (value === 1 || value === '1') return 'negative';
  if (value === 2 || value === '2') return 'neutral';
  if (value === 'positive' || value === 'negative' || value === 'neutral') return value;
  return 'positive';
};
const selectWavelength = payload => ({
  type: _action_type.HPLC_MS.UPDATE_UVVIS_WAVE_LENGTH,
  payload
});
exports.selectWavelength = selectWavelength;
const changeTic = payload => {
  const rawValue = payload?.target?.value ?? payload?.polarity ?? 'positive';
  const polarity = normalizeTicPolarity(rawValue);
  return {
    type: _action_type.HPLC_MS.SELECT_TIC_CURVE,
    payload: {
      polarity
    }
  };
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