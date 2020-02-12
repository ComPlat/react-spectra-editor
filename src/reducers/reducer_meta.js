import { META } from '../constants/action_type';

const initialState = {
  peaks: {
    intervalL: null,
    intervalR: null,
    observeFrequency: null,
    deltaX: null,
  },
};

const metaReducer = (state = initialState, action) => {
  switch (action.type) {
    case META.UPDATE_PEAKS_RDC:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

export default metaReducer;
