"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable default-param-last */

// Whether the y-axis is drawn inverted: seeded by LayerInit.execReset from the file's
// ##$CSINVERTY, then toggled by the user. Deliberately has no MANAGER.RESETALL case,
// so a viewer remounting (the ForecastViewer swap) or a threshold edit cannot reset
// the user's choice.
const invertYReducer = (state = false, action) => {
  switch (action.type) {
    case _action_type.INVERT_Y.TOGGLE:
      return !state;
    case _action_type.INVERT_Y.SEED:
      return Boolean(action.payload);
    default:
      return state;
  }
};
var _default = exports.default = invertYReducer;