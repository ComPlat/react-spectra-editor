'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rootSaga;

var _effects = require('redux-saga/effects');

var _saga_edit_peak = require('./saga_edit_peak');

var _saga_edit_peak2 = _interopRequireDefault(_saga_edit_peak);

var _saga_manager = require('./saga_manager');

var _saga_manager2 = _interopRequireDefault(_saga_manager);

var _saga_ui = require('./saga_ui');

var _saga_ui2 = _interopRequireDefault(_saga_ui);

var _saga_meta = require('./saga_meta');

var _saga_meta2 = _interopRequireDefault(_saga_meta);

var _saga_multiplicity = require('./saga_multiplicity');

var _saga_multiplicity2 = _interopRequireDefault(_saga_multiplicity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/regeneratorRuntime.mark(rootSaga);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function rootSaga() {
  return regeneratorRuntime.wrap(function rootSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.all)([].concat(_toConsumableArray(_saga_edit_peak2.default), _toConsumableArray(_saga_manager2.default), _toConsumableArray(_saga_ui2.default), _toConsumableArray(_saga_meta2.default), _toConsumableArray(_saga_multiplicity2.default)));

        case 2:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked);
}