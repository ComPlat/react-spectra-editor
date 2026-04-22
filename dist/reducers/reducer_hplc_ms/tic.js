"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTic = exports.updateThresholdValue = exports.updateCurrentPageValue = exports.resetThresholdValue = void 0;
var _persistence = require("./persistence");
/* eslint-disable prefer-object-spread */

const updateTic = (state, action) => {
  const {
    polarity
  } = action.payload;
  (0, _persistence.persistLcmsTicHints)(state.lcmsDatasetKey, {
    polarity
  });
  return {
    ...state,
    tic: {
      ...state.tic,
      polarity
    }
  };
};
exports.updateTic = updateTic;
const updateCurrentPageValue = (state, action) => {
  const {
    currentPageValue
  } = action.payload || {};
  (0, _persistence.persistLcmsTicHints)(state.lcmsDatasetKey, {
    mzPage: currentPageValue
  });
  return {
    ...state,
    tic: {
      ...state.tic,
      currentPageValue
    }
  };
};
exports.updateCurrentPageValue = updateCurrentPageValue;
const updateThresholdValue = (state, action) => {
  const {
    payload
  } = action;
  if (payload) {
    const {
      value
    } = payload;
    return {
      ...state,
      threshold: {
        isEdit: true,
        value,
        originalValue: state.threshold.originalValue ?? value
      }
    };
  }
  return state;
};
exports.updateThresholdValue = updateThresholdValue;
const resetThresholdValue = state => ({
  ...state,
  threshold: {
    isEdit: true,
    value: state.threshold.originalValue,
    originalValue: state.threshold.originalValue
  }
});
exports.resetThresholdValue = resetThresholdValue;