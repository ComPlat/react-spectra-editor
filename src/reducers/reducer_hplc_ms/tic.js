/* eslint-disable prefer-object-spread */
import { persistLcmsTicHints } from './persistence';

export const updateTic = (state, action) => {
  const { polarity } = action.payload;
  persistLcmsTicHints(state.lcmsDatasetKey, { polarity });
  return {
    ...state,
    tic: {
      ...state.tic,
      polarity,
    },
  };
};

export const updateCurrentPageValue = (state, action) => {
  const { currentPageValue } = action.payload || {};
  persistLcmsTicHints(state.lcmsDatasetKey, { mzPage: currentPageValue });
  return {
    ...state,
    tic: {
      ...state.tic,
      currentPageValue,
    },
  };
};

export const updateThresholdValue = (state, action) => {
  const { payload } = action;
  if (payload) {
    const { value } = payload;
    return {
      ...state,
      threshold: {
        isEdit: true,
        value,
        originalValue: state.threshold.originalValue ?? value,
      },
    };
  }
  return state;
};

export const resetThresholdValue = (state) => ({
  ...state,
  threshold: {
    isEdit: true,
    value: state.threshold.originalValue,
    originalValue: state.threshold.originalValue,
  },
});
