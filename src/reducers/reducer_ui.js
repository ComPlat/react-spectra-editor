import { UI, MANAGER } from '../constants/action_type';
import {
  LIST_UI_VIEWER_TYPE,
  LIST_UI_SWEEP_TYPE,
} from '../constants/list_ui';

const initialState = {
  viewer: LIST_UI_VIEWER_TYPE.SPECTRUM,
  sweepType: LIST_UI_SWEEP_TYPE.ZOOMIN,
  sweepExtent: { xExtent: false, yExtent: false },
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case UI.VIEWER.SET_TYPE:
      return Object.assign({}, state, {
        viewer: action.payload,
      });
    case UI.SWEEP.SET_TYPE:
      if (action.payload === LIST_UI_SWEEP_TYPE.ZOOMRESET) {
        return Object.assign({}, state, {
          sweepExtent: { xExtent: false, yExtent: false },
        });
      }
      return Object.assign({}, state, {
        sweepType: action.payload,
      });
    case UI.SWEEP.SELECT_ZOOMIN:
      return Object.assign({}, state, {
        sweepExtent: action.payload,
      });
    case MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};

export default uiReducer;
