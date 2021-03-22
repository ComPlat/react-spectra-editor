'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rmFromNegList = exports.rmFromPosList = undefined;

var _action_type = require('../constants/action_type');

var rmFromPosList = function rmFromPosList(payload) {
  return {
    type: _action_type.EDITPEAK.RM_POSITIVE,
    payload: payload
  };
};

var rmFromNegList = function rmFromNegList(payload) {
  return {
    type: _action_type.EDITPEAK.RM_NEGATIVE,
    payload: payload
  };
};

exports.rmFromPosList = rmFromPosList;
exports.rmFromNegList = rmFromNegList;