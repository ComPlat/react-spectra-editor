"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addOthersInit = void 0;
var _action_type = require("../constants/action_type");
const addOthersInit = payload => ({
  type: _action_type.JCAMP.ADD_OTHERS_INIT,
  payload
});
exports.addOthersInit = addOthersInit;