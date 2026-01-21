"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = {
  btnSubmit: false
};
const statusReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.STATUS.TOGGLEBTNSUBMIT:
      return Object.assign({}, state, {
        btnSubmit: false
      } // !state.btnSubmit
      );
    case _action_type.STATUS.TOGGLEBTNALL:
      return Object.assign({}, state, {
        btnSubmit: false
      } // !state.btnSubmit
      );
    case _action_type.STATUS.ENABLEBTNALL:
    case _action_type.EDITPEAK.ADDPOSITIVE:
    case _action_type.EDITPEAK.RMPOSITIVE:
    case _action_type.EDITPEAK.ADDNEGATIVE:
    case _action_type.EDITPEAK.RMNEGATIVE:
    case _action_type.THRESHOLD.UPDATE_VALUE:
    case _action_type.THRESHOLD.RESET_VALUE:
      return Object.assign({}, state, {
        btnSubmit: false
      });
    case _action_type.LAYOUT.UPDATE:
      return Object.assign({}, state, {
        btnSubmit: false
      });
    case _action_type.MANAGER.RESETALL:
      return initialState;
    default:
      return initialState;
  }
};
var _default = exports.default = statusReducer;