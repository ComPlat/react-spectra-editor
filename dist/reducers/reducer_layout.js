"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
var _list_layout = require("../constants/list_layout");
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = _list_layout.LIST_LAYOUT.C13;
const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.LAYOUT.UPDATE:
      return action.payload;
    case _action_type.MANAGER.RESETALL:
      {
        // A feature whose layout is PLAIN (or missing) only says the classifier did
        // not recognise its datatype -- it is not a layout choice. Keep the current
        // one: LayerInit.execReset sets PLAIN itself on an entity change, and a
        // viewer remounting on a layout picked by hand (e.g. the ForecastViewer swap)
        // must not reset that pick.
        const layout = action.payload?.operation?.layout;
        return layout && layout !== _list_layout.LIST_LAYOUT.PLAIN ? layout : state;
      }
    default:
      return state;
  }
};
var _default = exports.default = layoutReducer;