"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLayout = void 0;
var _action_type = require("../constants/action_type");
const updateLayout = payload => ({
  type: _action_type.LAYOUT.UPDATE,
  payload
});

// eslint-disable-line
exports.updateLayout = updateLayout;