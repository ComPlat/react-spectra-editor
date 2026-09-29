"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleInvertY = exports.seedInvertY = void 0;
var _action_type = require("../constants/action_type");
const toggleInvertY = () => ({
  type: _action_type.INVERT_Y.TOGGLE,
  payload: null
});

// payload: whether the y-axis starts inverted, from the file's ##$CSINVERTY.
exports.toggleInvertY = toggleInvertY;
const seedInvertY = payload => ({
  type: _action_type.INVERT_Y.SEED,
  payload
});

// eslint-disable-line
exports.seedInvertY = seedInvertY;