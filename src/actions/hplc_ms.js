import { HPLC_MS } from '../constants/action_type';

const normalizeTicPolarity = (value) => {
  if (value === 0 || value === '0') return 'positive';
  if (value === 1 || value === '1') return 'negative';
  if (value === 2 || value === '2') return 'neutral';
  if (value === 'positive' || value === 'negative' || value === 'neutral') return value;
  return 'positive';
};

export const selectWavelength = (payload) => ({
  type: HPLC_MS.UPDATE_UVVIS_WAVE_LENGTH,
  payload,
});

export const changeTic = (payload) => {
  const rawValue = payload?.target?.value ?? payload?.polarity ?? 'positive';
  const polarity = normalizeTicPolarity(rawValue);
  return {
    type: HPLC_MS.SELECT_TIC_CURVE,
    payload: {
      polarity,
    },
  };
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
