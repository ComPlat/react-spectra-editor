'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearAll = exports.toggleShow = exports.rmOthersOne = exports.addOthers = undefined;

var _action_type = require('../constants/action_type');

var addOthers = function addOthers(payload) {
  return {
    type: _action_type.JCAMP.ADD_OTHERS,
    payload: payload
  };
};

var rmOthersOne = function rmOthersOne(payload) {
  return {
    type: _action_type.JCAMP.RM_OTHERS_ONE,
    payload: payload
  };
};

var toggleShow = function toggleShow(payload) {
  return {
    type: _action_type.JCAMP.TOGGLE_SHOW,
    payload: payload
  };
};

var clearAll = function clearAll(payload) {
  return {
    type: _action_type.JCAMP.CLEAR_ALL,
    payload: payload
  };
};

exports.addOthers = addOthers;
exports.rmOthersOne = rmOthersOne;
exports.toggleShow = toggleShow;
exports.clearAll = clearAll;