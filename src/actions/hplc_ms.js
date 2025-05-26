import { HPLC_MS } from '../constants/action_type';

export const selectWavelength = (payload) => ({
  type: HPLC_MS.UPDATE_UVVIS_WAVE_LENGTH,
  payload,
});

export const changeTic = (payload) => {
  const isNegative = payload.target.value === 1;
  const action = {
    type: HPLC_MS.SELECT_TIC_CURVE,
    payload: {
      isNegative,
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
