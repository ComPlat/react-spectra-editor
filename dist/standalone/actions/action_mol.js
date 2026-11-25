"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addMolInit = void 0;
var _action_type = require("../constants/action_type");
const addMolInit = payload => ({
  type: _action_type.MOL.ADD_INIT,
  payload
});
exports.addMolInit = addMolInit;