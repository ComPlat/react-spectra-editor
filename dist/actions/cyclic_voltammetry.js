'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeCylicVoltaPecker = exports.addCylicVoltaPecker = exports.selectPairPeak = exports.setWorkWithMaxPeak = exports.removeCylicVoltaMinPeak = exports.addCylicVoltaMinPeak = exports.removeCylicVoltaMaxPeak = exports.addCylicVoltaMaxPeak = exports.removeCylicVoltaPairPeak = exports.addNewCylicVoltaPairPeak = undefined;

var _action_type = require('../constants/action_type');

var addNewCylicVoltaPairPeak = function addNewCylicVoltaPairPeak(payload) {
  return {
    type: _action_type.CYCLIC_VOLTA_METRY.ADD_PAIR_PEAKS,
    payload: payload
  };
};

var removeCylicVoltaPairPeak = function removeCylicVoltaPairPeak(payload) {
  return {
    type: _action_type.CYCLIC_VOLTA_METRY.REMOVE_PAIR_PEAKS,
    payload: payload
  };
};

var addCylicVoltaMaxPeak = function addCylicVoltaMaxPeak(payload) {
  return {
    type: _action_type.CYCLIC_VOLTA_METRY.ADD_MAX_PEAK,
    payload: payload
  };
};

var removeCylicVoltaMaxPeak = function removeCylicVoltaMaxPeak(payload) {
  return {
    type: _action_type.CYCLIC_VOLTA_METRY.REMOVE_MAX_PEAK,
    payload: payload
  };
};

var addCylicVoltaMinPeak = function addCylicVoltaMinPeak(payload) {
  return {
    type: _action_type.CYCLIC_VOLTA_METRY.ADD_MIN_PEAK,
    payload: payload
  };
};

var removeCylicVoltaMinPeak = function removeCylicVoltaMinPeak(payload) {
  return {
    type: _action_type.CYCLIC_VOLTA_METRY.REMOVE_MIN_PEAK,
    payload: payload
  };
};

var setWorkWithMaxPeak = function setWorkWithMaxPeak(payload) {
  return {
    type: _action_type.CYCLIC_VOLTA_METRY.WORK_WITH_MAX_PEAK,
    payload: payload
  };
};

var selectPairPeak = function selectPairPeak(payload) {
  return {
    type: _action_type.CYCLIC_VOLTA_METRY.SELECT_PAIR_PEAK,
    payload: payload
  };
};

var addCylicVoltaPecker = function addCylicVoltaPecker(payload) {
  return {
    type: _action_type.CYCLIC_VOLTA_METRY.ADD_PECKER,
    payload: payload
  };
};

var removeCylicVoltaPecker = function removeCylicVoltaPecker(payload) {
  return {
    type: _action_type.CYCLIC_VOLTA_METRY.REMOVE_PECKER,
    payload: payload
  };
};

exports.addNewCylicVoltaPairPeak = addNewCylicVoltaPairPeak;
exports.removeCylicVoltaPairPeak = removeCylicVoltaPairPeak;
exports.addCylicVoltaMaxPeak = addCylicVoltaMaxPeak;
exports.removeCylicVoltaMaxPeak = removeCylicVoltaMaxPeak;
exports.addCylicVoltaMinPeak = addCylicVoltaMinPeak;
exports.removeCylicVoltaMinPeak = removeCylicVoltaMinPeak;
exports.setWorkWithMaxPeak = setWorkWithMaxPeak;
exports.selectPairPeak = selectPairPeak;
exports.addCylicVoltaPecker = addCylicVoltaPecker;
exports.removeCylicVoltaPecker = removeCylicVoltaPecker;