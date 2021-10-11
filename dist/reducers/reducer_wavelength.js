"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _list_wavelength = require("../constants/list_wavelength");

var _action_type = require("../constants/action_type");

var initialState = _list_wavelength.LIST_WAVE_LENGTH[0];

var wavelengthReducer = function wavelengthReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _action_type.XRD.UPDATE_WAVE_LENGTH:
      return action.payload;
    default:
      return state;
  }
};

exports.default = wavelengthReducer;