import { LIST_WAVE_LENGTH } from "../constants/list_wavelength";
import { XRD } from "../constants/action_type";

const initialState = LIST_WAVE_LENGTH[0];

const wavelengthReducer = (state = initialState, action) => {
  switch(action.type) {
    case XRD.UPDATE_WAVE_LENGTH:
      return action.payload;
    default:
      return state;
  }
};

export default wavelengthReducer;