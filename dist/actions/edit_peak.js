"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rmFromPosList = exports.rmFromNegList = void 0;
var _action_type = require("../constants/action_type");
const rmFromPosList = payload => ({
  type: _action_type.EDITPEAK.RM_POSITIVE,
  payload
});
exports.rmFromPosList = rmFromPosList;
const rmFromNegList = payload => ({
  type: _action_type.EDITPEAK.RM_NEGATIVE,
  payload
});
exports.rmFromNegList = rmFromNegList;