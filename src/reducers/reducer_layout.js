/* eslint-disable prefer-object-spread, default-param-last */
import { LAYOUT, MANAGER } from '../constants/action_type';
import { LIST_LAYOUT } from '../constants/list_layout';

const initialState = LIST_LAYOUT.C13;

const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case LAYOUT.UPDATE:
      return action.payload;
    case MANAGER.RESETALL: {
      // A feature whose layout is PLAIN (or missing) only says the classifier did
      // not recognise its datatype -- it is not a layout choice. Keep the current
      // one: LayerInit.execReset sets PLAIN itself on an entity change, and a
      // viewer remounting on a layout picked by hand (e.g. the ForecastViewer swap)
      // must not reset that pick.
      const layout = action.payload?.operation?.layout;
      return (layout && layout !== LIST_LAYOUT.PLAIN) ? layout : state;
    }
    default:
      return state;
  }
};

export default layoutReducer;
