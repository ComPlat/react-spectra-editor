"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setWorkWithMaxPeak = exports.selectPairPeak = exports.removeCylicVoltaPecker = exports.removeCylicVoltaPairPeak = exports.removeCylicVoltaMinPeak = exports.removeCylicVoltaMaxPeak = exports.addNewCylicVoltaPairPeak = exports.addCylicVoltaPecker = exports.addCylicVoltaMinPeak = exports.addCylicVoltaMaxPeak = void 0;
var _action_type = require("../constants/action_type");
const addNewCylicVoltaPairPeak = payload => ({
  type: _action_type.CYCLIC_VOLTA_METRY.ADD_PAIR_PEAKS,
  payload
});
exports.addNewCylicVoltaPairPeak = addNewCylicVoltaPairPeak;
const removeCylicVoltaPairPeak = payload => ({
  type: _action_type.CYCLIC_VOLTA_METRY.REMOVE_PAIR_PEAKS,
  payload
});
exports.removeCylicVoltaPairPeak = removeCylicVoltaPairPeak;
const addCylicVoltaMaxPeak = payload => ({
  type: _action_type.CYCLIC_VOLTA_METRY.ADD_MAX_PEAK,
  payload
});
exports.addCylicVoltaMaxPeak = addCylicVoltaMaxPeak;
const removeCylicVoltaMaxPeak = payload => ({
  type: _action_type.CYCLIC_VOLTA_METRY.REMOVE_MAX_PEAK,
  payload
});
exports.removeCylicVoltaMaxPeak = removeCylicVoltaMaxPeak;
const addCylicVoltaMinPeak = payload => ({
  type: _action_type.CYCLIC_VOLTA_METRY.ADD_MIN_PEAK,
  payload
});
exports.addCylicVoltaMinPeak = addCylicVoltaMinPeak;
const removeCylicVoltaMinPeak = payload => ({
  type: _action_type.CYCLIC_VOLTA_METRY.REMOVE_MIN_PEAK,
  payload
});
exports.removeCylicVoltaMinPeak = removeCylicVoltaMinPeak;
const setWorkWithMaxPeak = payload => ({
  type: _action_type.CYCLIC_VOLTA_METRY.WORK_WITH_MAX_PEAK,
  payload
});
exports.setWorkWithMaxPeak = setWorkWithMaxPeak;
const selectPairPeak = payload => ({
  type: _action_type.CYCLIC_VOLTA_METRY.SELECT_PAIR_PEAK,
  payload
});
exports.selectPairPeak = selectPairPeak;
const addCylicVoltaPecker = payload => ({
  type: _action_type.CYCLIC_VOLTA_METRY.ADD_PECKER,
  payload
});
exports.addCylicVoltaPecker = addCylicVoltaPecker;
const removeCylicVoltaPecker = payload => ({
  type: _action_type.CYCLIC_VOLTA_METRY.REMOVE_PECKER,
  payload
});
exports.removeCylicVoltaPecker = removeCylicVoltaPecker;