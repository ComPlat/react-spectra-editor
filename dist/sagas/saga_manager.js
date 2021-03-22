'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _effects = require('redux-saga/effects');

var _action_type = require('../constants/action_type');

var _marked = /*#__PURE__*/regeneratorRuntime.mark(resetShift),
    _marked2 = /*#__PURE__*/regeneratorRuntime.mark(resetInitNmr);

var getLayout = function getLayout(state) {
  return state.layout;
};

function resetShift(action) {
  var layout, payload;
  return regeneratorRuntime.wrap(function resetShift$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.select)(getLayout);

        case 2:
          layout = _context.sent;
          payload = action.payload;
          _context.next = 6;
          return (0, _effects.put)({
            type: _action_type.MANAGER.RESETSHIFT,
            payload: Object.assign({}, payload, {
              layout: layout
            })
          });

        case 6:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked);
}

function resetInitNmr(action) {
  var _action$payload, integration, simulation;

  return regeneratorRuntime.wrap(function resetInitNmr$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _action$payload = action.payload, integration = _action$payload.integration, simulation = _action$payload.simulation;

          if (!integration) {
            _context2.next = 4;
            break;
          }

          _context2.next = 4;
          return (0, _effects.put)({
            type: _action_type.INTEGRATION.RESET_ALL_RDC,
            payload: integration
          });

        case 4:
          if (!simulation) {
            _context2.next = 7;
            break;
          }

          _context2.next = 7;
          return (0, _effects.put)({
            type: _action_type.SIMULATION.RESET_ALL_RDC,
            payload: simulation
          });

        case 7:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2);
}

var managerSagas = [(0, _effects.takeEvery)(_action_type.MANAGER.RESETALL, resetShift), (0, _effects.takeEvery)(_action_type.MANAGER.RESET_INIT_NMR, resetInitNmr)];

exports.default = managerSagas;