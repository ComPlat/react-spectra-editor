/* eslint-disable prefer-object-spread, default-param-last */
import { META } from '../constants/action_type';

const initialState = {
  peaks: {
    intervalL: null,
    intervalR: null,
    observeFrequency: null,
    deltaX: null,
  },
  dscMetaData: {
    meltingPoint: null,
    tg: null,
  },
};

const updateMetaData = (state, action) => {
  const { dscMetaData } = action.payload;
  return Object.assign({}, state, { dscMetaData });
};

const metaReducer = (state = initialState, action) => {
  switch (action.type) {
    case META.UPDATE_PEAKS_RDC:
      return Object.assign({}, state, action.payload);
    case META.UPDATE_META_DATA_RDC:
      return updateMetaData(state, action);
    default:
      return state;
  }
};

export default metaReducer;
