'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _effects = require('redux-saga/effects');

var _action_type = require('../constants/action_type');

var _marked = /*#__PURE__*/regeneratorRuntime.mark(resetShift),
    _marked2 = /*#__PURE__*/regeneratorRuntime.mark(resetInitNmr),
    _marked3 = /*#__PURE__*/regeneratorRuntime.mark(resetInitCommonWithIntergation);

var getLayout = function getLayout(state) {
  return state.layout;
};
var getCurveSt = function getCurveSt(state) {
  return state.curve;
};
var getIntegrationSt = function getIntegrationSt(state) {
  return state.integration.present;
};
var getShiftSt = function getShiftSt(state) {
  return state.shift;
};

function resetShift(action) {
  var curveSt, layout, shiftSt, payload;
  return regeneratorRuntime.wrap(function resetShift$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.select)(getCurveSt);

        case 2:
          curveSt = _context.sent;
          _context.next = 5;
          return (0, _effects.select)(getLayout);

        case 5:
          layout = _context.sent;
          _context.next = 8;
          return (0, _effects.select)(getShiftSt);

        case 8:
          shiftSt = _context.sent;
          payload = action.payload;
          // const { shift } = payload;
          // console.log(payload);
          // console.log(shiftSt);
          // const { curveIdx } = curveSt;
          // const { shifts } = shiftSt;
          // shifts[curveIdx] = shift;

          // const newPayload = Object.assign({}, shiftSt, { shifts, selectedIdx: curveIdx })

          _context.next = 12;
          return (0, _effects.put)({
            type: _action_type.MANAGER.RESETSHIFT,
            payload: Object.assign({}, payload, {
              layout: layout
            })
          });

        case 12:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked);
}

function resetInitNmr(action) {
  var curveSt, integationSt, curveIdx, _action$payload, integration, simulation, integrations, payload;

  return regeneratorRuntime.wrap(function resetInitNmr$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _effects.select)(getCurveSt);

        case 2:
          curveSt = _context2.sent;
          _context2.next = 5;
          return (0, _effects.select)(getIntegrationSt);

        case 5:
          integationSt = _context2.sent;
          curveIdx = curveSt.curveIdx;
          _action$payload = action.payload, integration = _action$payload.integration, simulation = _action$payload.simulation;
          integrations = integationSt.integrations;

          integrations[curveIdx] = integration;

          payload = Object.assign({}, integationSt, { integrations: integrations, selectedIdx: curveIdx });

          if (!integration) {
            _context2.next = 14;
            break;
          }

          _context2.next = 14;
          return (0, _effects.put)({
            type: _action_type.INTEGRATION.RESET_ALL_RDC,
            payload: payload
          });

        case 14:
          if (!simulation) {
            _context2.next = 17;
            break;
          }

          _context2.next = 17;
          return (0, _effects.put)({
            type: _action_type.SIMULATION.RESET_ALL_RDC,
            payload: simulation
          });

        case 17:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2);
}

function resetInitCommonWithIntergation(action) {
  var curveSt, integationSt, curveIdx, integration, integrations, payload;
  return regeneratorRuntime.wrap(function resetInitCommonWithIntergation$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return (0, _effects.select)(getCurveSt);

        case 2:
          curveSt = _context3.sent;
          _context3.next = 5;
          return (0, _effects.select)(getIntegrationSt);

        case 5:
          integationSt = _context3.sent;
          curveIdx = curveSt.curveIdx;
          integration = action.payload.integration;
          integrations = integationSt.integrations;

          integrations[curveIdx] = integration;

          payload = Object.assign({}, integationSt, { integrations: integrations, selectedIdx: curveIdx });

          if (!integration) {
            _context3.next = 14;
            break;
          }

          _context3.next = 14;
          return (0, _effects.put)({
            type: _action_type.INTEGRATION.RESET_ALL_RDC,
            payload: payload
          });

        case 14:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked3);
}

var managerSagas = [(0, _effects.takeEvery)(_action_type.MANAGER.RESETALL, resetShift), (0, _effects.takeEvery)(_action_type.MANAGER.RESET_INIT_NMR, resetInitNmr), (0, _effects.takeEvery)(_action_type.MANAGER.RESET_INIT_COMMON_WITH_INTERGATION, resetInitCommonWithIntergation)];

exports.default = managerSagas;