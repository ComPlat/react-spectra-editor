"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _list_wavelength = require("../constants/list_wavelength");
var _action_type = require("../constants/action_type");
/* eslint-disable default-param-last */

const initialState = _list_wavelength.LIST_WAVE_LENGTH[0];
const wavelengthReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.XRD.UPDATE_WAVE_LENGTH:
      return action.payload;
    default:
      return state;
  }
};
var _default = exports.default = wavelengthReducer;