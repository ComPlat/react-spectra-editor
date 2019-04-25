import { UI, MANAGER } from '../constants/action_type';

const initialState = {
  viewer: {
    panelIdx: 0,
  },
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case UI.VIEWER.SET_PANEL_IDX:
      return Object.assign({}, state, {
        viewer: {
          panelIdx: action.payload,
        },
      });
    case MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};

export default uiReducer;
