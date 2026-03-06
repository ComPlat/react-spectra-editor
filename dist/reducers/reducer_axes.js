"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable default-param-last, prefer-object-spread */

const initialState = {
  axes: [{
    xUnit: '',
    yUnit: ''
  }]
};
const updateAxis = (state, payload, isYAxis = false) => {
  const {
    value,
    curveIndex
  } = payload;
  const {
    axes
  } = state;
  let selectedAxes = axes[curveIndex];
  if (!selectedAxes) {
    selectedAxes = {
      xUnit: '',
      yUnit: ''
    };
  }
  let newAxes = null;
  if (isYAxis) {
    newAxes = Object.assign({}, selectedAxes, {
      yUnit: value
    });
  } else {
    newAxes = Object.assign({}, selectedAxes, {
      xUnit: value
    });
  }
  axes[curveIndex] = newAxes;
  return Object.assign({}, state, {
    axes
  });
};
const axesReducer = (state = initialState, action) => {
  switch (action.type) {
    case _action_type.AXES.UPDATE_X_AXIS:
      return updateAxis(state, action.payload);
    case _action_type.AXES.UPDATE_Y_AXIS:
      return updateAxis(state, action.payload, true);
    default:
      return state;
  }
};
var _default = exports.default = axesReducer;