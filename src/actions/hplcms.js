import { HPLC_MS } from '../constants/action_type';

const selectWavelength = (payload) => (
  {
    type: HPLC_MS.UPDATE_UVVIS_WAVE_LENGTH,
    payload,
  }
);

const changeTic = (payload) => (
  {
    type: HPLC_MS.SELECT_TIC_CURVE,
    payload,
  }
);

export {
  selectWavelength, changeTic,
};
