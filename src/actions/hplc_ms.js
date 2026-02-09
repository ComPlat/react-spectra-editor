import { HPLC_MS } from '../constants/action_type';

export const selectWavelength = (payload) => ({
  type: HPLC_MS.UPDATE_UVVIS_WAVE_LENGTH,
  payload,
});

export const changeTic = (payload) => {
  const rawValue = payload?.target?.value ?? payload?.polarity ?? 'positive';
  let polarity = rawValue;
  if (rawValue === 0 || rawValue === '0') polarity = 'positive';
  if (rawValue === 1 || rawValue === '1') polarity = 'negative';
  if (rawValue === 2 || rawValue === '2') polarity = 'neutral';
  const action = {
    type: HPLC_MS.SELECT_TIC_CURVE,
    payload: {
      polarity,
    },
  };
  return action;
};

export const updateCurrentPageValue = (currentPageValue) => ({
  type: HPLC_MS.UPDATE_CURRENT_PAGE_VALUE,
  payload: { currentPageValue },
});

export const clearIntegrationAllHplcMs = (payload) => ({
  type: HPLC_MS.CLEAR_INTEGRATION_ALL_HPLCMS,
  payload,
});

export const clearAllPeaksHplcMs = (payload) => ({
  type: HPLC_MS.CLEAR_ALL_PEAKS_HPLCMS,
  payload,
});
