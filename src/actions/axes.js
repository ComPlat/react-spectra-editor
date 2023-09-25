import { AXES } from '../constants/action_type';

const updateXAxis = (payload) => (
  {
    type: AXES.UPDATE_X_AXIS,
    payload,
  }
);

const updateYAxis = (payload) => (
  {
    type: AXES.UPDATE_Y_AXIS,
    payload,
  }
);

export { updateXAxis, updateYAxis }; // eslint-disable-line
