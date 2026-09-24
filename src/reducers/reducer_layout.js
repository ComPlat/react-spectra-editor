/* eslint-disable prefer-object-spread, default-param-last */
import { LAYOUT, MANAGER } from '../constants/action_type';
import { LIST_LAYOUT } from '../constants/list_layout';

const initialState = LIST_LAYOUT.PLAIN;

const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case LAYOUT.UPDATE:
      return action.payload;
    case MANAGER.RESETALL:
      // A feature's operation.layout is only ever missing/falsy for a
      // malformed payload, never as an intentional "keep the current
      // layout" signal -- falling back to the possibly-stale `state` here
      // (rather than the same neutral PLAIN every other consumer falls
      // back to) is what let a child's RESETALL dispatch on an
      // unrecognized-datatype entity render one frame under whatever
      // layout the *previous* entity had, ahead of LayerInit.execReset.
      return action.payload?.operation?.layout || LIST_LAYOUT.PLAIN;
    default:
      return state;
  }
};

export default layoutReducer;
