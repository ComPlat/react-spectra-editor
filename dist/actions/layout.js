'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLayout = undefined;

var _action_type = require('../constants/action_type');

var updateLayout = function updateLayout(payload) {
  return {
    type: _action_type.LAYOUT.UPDATE,
    payload: payload
  };
};

exports.updateLayout = updateLayout; // eslint-disable-line