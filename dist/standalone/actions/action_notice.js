"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.manualClear = void 0;
var _action_type = require("../constants/action_type");
const manualClear = payload => ({
  type: _action_type.NOTICE.MANUAL_CLEAR,
  payload
});
exports.manualClear = manualClear;