'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _reducer_threshold = require('./reducer_threshold');

var _reducer_threshold2 = _interopRequireDefault(_reducer_threshold);

var _reducer_edit_peak = require('./reducer_edit_peak');

var _reducer_edit_peak2 = _interopRequireDefault(_reducer_edit_peak);

var _reducer_status = require('./reducer_status');

var _reducer_status2 = _interopRequireDefault(_reducer_status);

var _reducer_manager = require('./reducer_manager');

var _reducer_manager2 = _interopRequireDefault(_reducer_manager);

var _reducer_layout = require('./reducer_layout');

var _reducer_layout2 = _interopRequireDefault(_reducer_layout);

var _reducer_shift = require('./reducer_shift');

var _reducer_shift2 = _interopRequireDefault(_reducer_shift);

var _reducer_scan = require('./reducer_scan');

var _reducer_scan2 = _interopRequireDefault(_reducer_scan);

var _reducer_forecast = require('./reducer_forecast');

var _reducer_forecast2 = _interopRequireDefault(_reducer_forecast);

var _reducer_ui = require('./reducer_ui');

var _reducer_ui2 = _interopRequireDefault(_reducer_ui);

var _reducer_submit = require('./reducer_submit');

var _reducer_submit2 = _interopRequireDefault(_reducer_submit);

var _reducer_integration = require('./reducer_integration');

var _reducer_integration2 = _interopRequireDefault(_reducer_integration);

var _reducer_multiplicity = require('./reducer_multiplicity');

var _reducer_multiplicity2 = _interopRequireDefault(_reducer_multiplicity);

var _reducer_simulation = require('./reducer_simulation');

var _reducer_simulation2 = _interopRequireDefault(_reducer_simulation);

var _reducer_meta = require('./reducer_meta');

var _reducer_meta2 = _interopRequireDefault(_reducer_meta);

var _reducer_jcamp = require('./reducer_jcamp');

var _reducer_jcamp2 = _interopRequireDefault(_reducer_jcamp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootReducer = (0, _redux.combineReducers)({
  threshold: _reducer_threshold2.default,
  editPeak: _reducer_edit_peak2.default,
  status: _reducer_status2.default,
  manager: _reducer_manager2.default,
  layout: _reducer_layout2.default,
  shift: _reducer_shift2.default,
  scan: _reducer_scan2.default,
  forecast: _reducer_forecast2.default,
  ui: _reducer_ui2.default,
  submit: _reducer_submit2.default,
  integration: _reducer_integration2.default,
  multiplicity: _reducer_multiplicity2.default,
  simulation: _reducer_simulation2.default,
  meta: _reducer_meta2.default,
  jcamp: _reducer_jcamp2.default
});

exports.default = rootReducer;