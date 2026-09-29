/* eslint-disable default-param-last */
import { INVERT_Y } from '../constants/action_type';

// Whether the y-axis is drawn inverted: seeded by LayerInit.execReset from the file's
// ##$CSINVERTY, then toggled by the user. Deliberately has no MANAGER.RESETALL case,
// so a viewer remounting (the ForecastViewer swap) or a threshold edit cannot reset
// the user's choice.
const invertYReducer = (state = false, action) => {
  switch (action.type) {
    case INVERT_Y.TOGGLE:
      return !state;
    case INVERT_Y.SEED:
      return Boolean(action.payload);
    default:
      return state;
  }
};

export default invertYReducer;
