/* eslint-disable default-param-last, prefer-object-spread */
import { AXES } from '../constants/action_type';

const initialState = {
  xUnit: '',
  yUnit: '',
};

const updateAxis = (state, payload, isYAxis = false) => {
  if (isYAxis) {
    return Object.assign({}, state, { yUnit: payload });
  }

  return Object.assign({}, state, { xUnit: payload });
};

const axesReducer = (state = initialState, action) => {
  switch (action.type) {
    case AXES.UPDATE_X_AXIS:
      return updateAxis(state, action.payload);
    case AXES.UPDATE_Y_AXIS:
      return updateAxis(state, action.payload, true);
    default:
      return state;
  }
};

export default axesReducer;
