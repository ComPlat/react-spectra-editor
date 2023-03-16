'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _effects = require('redux-saga/effects');

var _action_type = require('../constants/action_type');

var _list_layout = require('../constants/list_layout');

var _marked = /*#__PURE__*/regeneratorRuntime.mark(setCyclicVoltametry);

var getCurveSt = function getCurveSt(state) {
  return state.curve;
};
var getLayoutSt = function getLayoutSt(state) {
  return state.layout;
};

function getMaxMinPeak(curve) {
  return curve.maxminPeak;
}

function setCyclicVoltametry(action) {
  var layoutSt, curveSt, listCurves, numberOfCurves, index, curve, maxminPeak, pidx, maxPeak, minPeak, pecker;
  return regeneratorRuntime.wrap(function setCyclicVoltametry$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.select)(getLayoutSt);

        case 2:
          layoutSt = _context.sent;

          if (!(layoutSt !== _list_layout.LIST_LAYOUT.CYCLIC_VOLTAMMETRY)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt('return');

        case 5:
          _context.next = 7;
          return (0, _effects.select)(getCurveSt);

        case 7:
          curveSt = _context.sent;
          listCurves = curveSt.listCurves;

          if (!listCurves) {
            _context.next = 38;
            break;
          }

          _context.next = 12;
          return (0, _effects.put)({
            type: _action_type.CYCLIC_VOLTA_METRY.RESETALL,
            payload: null
          });

        case 12:
          numberOfCurves = listCurves.length;

          if (!(numberOfCurves <= 0)) {
            _context.next = 15;
            break;
          }

          return _context.abrupt('return');

        case 15:
          index = 0;

        case 16:
          if (!(index < listCurves.length)) {
            _context.next = 38;
            break;
          }

          curve = listCurves[index];
          maxminPeak = getMaxMinPeak(curve);
          _context.next = 21;
          return (0, _effects.put)({
            type: _action_type.CYCLIC_VOLTA_METRY.ADD_PAIR_PEAKS,
            payload: index
          });

        case 21:
          pidx = 0;

        case 22:
          if (!(pidx < maxminPeak.max.length)) {
            _context.next = 35;
            break;
          }

          maxPeak = maxminPeak.max[pidx];
          _context.next = 26;
          return (0, _effects.put)({
            type: _action_type.CYCLIC_VOLTA_METRY.ADD_MAX_PEAK,
            payload: { peak: maxPeak, index: pidx, jcampIdx: index }
          });

        case 26:
          minPeak = maxminPeak.min[pidx];
          _context.next = 29;
          return (0, _effects.put)({
            type: _action_type.CYCLIC_VOLTA_METRY.ADD_MIN_PEAK,
            payload: { peak: minPeak, index: pidx, jcampIdx: index }
          });

        case 29:
          pecker = maxminPeak.pecker[pidx];
          _context.next = 32;
          return (0, _effects.put)({
            type: _action_type.CYCLIC_VOLTA_METRY.ADD_PECKER,
            payload: { peak: pecker, index: pidx, jcampIdx: index }
          });

        case 32:
          pidx++;
          _context.next = 22;
          break;

        case 35:
          index++;
          _context.next = 16;
          break;

        case 38:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked);
}

var multiEntitiesSagas = [(0, _effects.takeEvery)(_action_type.CURVE.SET_ALL_CURVES, setCyclicVoltametry)];

exports.default = multiEntitiesSagas;