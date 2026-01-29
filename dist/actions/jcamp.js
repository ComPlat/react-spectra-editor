"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleShow = exports.rmOthersOne = exports.clearAll = exports.addOthers = void 0;
var _action_type = require("../constants/action_type");
const addOthers = payload => ({
  type: _action_type.JCAMP.ADD_OTHERS,
  payload
});
exports.addOthers = addOthers;
const rmOthersOne = payload => ({
  type: _action_type.JCAMP.RM_OTHERS_ONE,
  payload
});
exports.rmOthersOne = rmOthersOne;
const toggleShow = payload => ({
  type: _action_type.JCAMP.TOGGLE_SHOW,
  payload
});
exports.toggleShow = toggleShow;
const clearAll = payload => ({
  type: _action_type.JCAMP.CLEAR_ALL,
  payload
});
exports.clearAll = clearAll;