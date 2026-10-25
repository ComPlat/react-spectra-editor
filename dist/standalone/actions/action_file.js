"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveFileInit = exports.refreshFileInit = exports.addFileInit = void 0;
var _action_type = require("../constants/action_type");
const addFileInit = payload => ({
  type: _action_type.FILE.ADD_INIT,
  payload
});
exports.addFileInit = addFileInit;
const saveFileInit = payload => ({
  type: _action_type.FILE.SAVE_INIT,
  payload
});
exports.saveFileInit = saveFileInit;
const refreshFileInit = payload => ({
  type: _action_type.FILE.REFRESH_INIT,
  payload
});
exports.refreshFileInit = refreshFileInit;