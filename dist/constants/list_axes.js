"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LIST_AXES = void 0;
var _list_layout = require("./list_layout");
const optionsAxisX = {
  [_list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY]: ['', 'Voltage in V', 'Voltage vs Ref in V', 'Potential in V', 'Potential vs Ref in V'],
  [_list_layout.LIST_LAYOUT.LSV]: ['', 'Voltage in V', 'Voltage vs Ref in V', 'Potential in V', 'Potential vs Ref in V']
};
const optionsAxisY = {
  [_list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY]: ['', 'Current in A', 'Current in mA'],
  [_list_layout.LIST_LAYOUT.LSV]: ['', 'Current in A', 'Current in mA']
};
const LIST_AXES = exports.LIST_AXES = {
  x: optionsAxisX,
  y: optionsAxisY
};