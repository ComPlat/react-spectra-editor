import { XRD } from "../constants/action_type";

const updateWaveLength = payload => (
  {
    type: XRD.UPDATE_WAVE_LENGTH,
    payload: payload,
  }
);

export { updateWaveLength }; // eslint-disable-line