"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _redux = require("redux");
var _reducer_threshold = _interopRequireDefault(require("./reducer_threshold"));
var _reducer_edit_peak = _interopRequireDefault(require("./reducer_edit_peak"));
var _reducer_status = _interopRequireDefault(require("./reducer_status"));
var _reducer_manager = _interopRequireDefault(require("./reducer_manager"));
var _reducer_layout = _interopRequireDefault(require("./reducer_layout"));
var _reducer_shift = _interopRequireDefault(require("./reducer_shift"));
var _reducer_scan = _interopRequireDefault(require("./reducer_scan"));
var _reducer_forecast = _interopRequireDefault(require("./reducer_forecast"));
var _reducer_ui = _interopRequireDefault(require("./reducer_ui"));
var _reducer_submit = _interopRequireDefault(require("./reducer_submit"));
var _reducer_integration = _interopRequireDefault(require("./reducer_integration"));
var _reducer_multiplicity = _interopRequireDefault(require("./reducer_multiplicity"));
var _reducer_simulation = _interopRequireDefault(require("./reducer_simulation"));
var _reducer_meta = _interopRequireDefault(require("./reducer_meta"));
var _reducer_jcamp = _interopRequireDefault(require("./reducer_jcamp"));
var _reducer_wavelength = _interopRequireDefault(require("./reducer_wavelength"));
var _reducer_voltammetry = _interopRequireDefault(require("./reducer_voltammetry"));
var _reducer_curve = _interopRequireDefault(require("./reducer_curve"));
const rootReducer = (0, _redux.combineReducers)({
  threshold: _reducer_threshold.default,
  editPeak: _reducer_edit_peak.default,
  status: _reducer_status.default,
  manager: _reducer_manager.default,
  layout: _reducer_layout.default,
  shift: _reducer_shift.default,
  scan: _reducer_scan.default,
  forecast: _reducer_forecast.default,
  ui: _reducer_ui.default,
  submit: _reducer_submit.default,
  integration: _reducer_integration.default,
  multiplicity: _reducer_multiplicity.default,
  simulation: _reducer_simulation.default,
  meta: _reducer_meta.default,
  jcamp: _reducer_jcamp.default,
  wavelength: _reducer_wavelength.default,
  cyclicvolta: _reducer_voltammetry.default,
  curve: _reducer_curve.default
});
var _default = rootReducer;
exports.default = _default;