"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateDesc = void 0;
var _action_type = require("../constants/action_type");
const updateDesc = payload => ({
  type: _action_type.DESC.UPDATE,
  payload
});
exports.updateDesc = updateDesc;