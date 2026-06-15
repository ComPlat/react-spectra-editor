"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateYAxis = exports.updateXAxis = void 0;
var _action_type = require("../constants/action_type");
const updateXAxis = payload => ({
  type: _action_type.AXES.UPDATE_X_AXIS,
  payload
});
exports.updateXAxis = updateXAxis;
const updateYAxis = payload => ({
  type: _action_type.AXES.UPDATE_Y_AXIS,
  payload
});

// eslint-disable-line
exports.updateYAxis = updateYAxis;