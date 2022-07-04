'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _effects = require('redux-saga/effects');

var _action_type = require('../constants/action_type');

var _marked = /*#__PURE__*/regeneratorRuntime.mark(setCyclicVoltametry);

var getCurveSt = function getCurveSt(state) {
  return state.curve;
};

function getMaxMinPeak(curve) {
  return curve.maxminPeak;
}

function setCyclicVoltametry(action) {
  var curveSt, listCurves, index, curve, maxminPeak, pidx, maxPeak, minPeak, pecker;
  return regeneratorRuntime.wrap(function setCyclicVoltametry$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.select)(getCurveSt);

        case 2:
          curveSt = _context.sent;
          listCurves = curveSt.listCurves;

          if (!listCurves) {
            _context.next = 30;
            break;
          }

          _context.next = 7;
          return (0, _effects.put)({
            type: _action_type.CYCLIC_VOLTA_METRY.RESETALL,
            payload: null
          });

        case 7:
          index = 0;

        case 8:
          if (!(index < listCurves.length)) {
            _context.next = 30;
            break;
          }

          curve = listCurves[index];
          maxminPeak = getMaxMinPeak(curve);
          _context.next = 13;
          return (0, _effects.put)({
            type: _action_type.CYCLIC_VOLTA_METRY.ADD_PAIR_PEAKS,
            payload: index
          });

        case 13:
          pidx = 0;

        case 14:
          if (!(pidx < maxminPeak.max.length)) {
            _context.next = 27;
            break;
          }

          maxPeak = maxminPeak.max[pidx];
          _context.next = 18;
          return (0, _effects.put)({
            type: _action_type.CYCLIC_VOLTA_METRY.ADD_MAX_PEAK,
            payload: { peak: maxPeak, index: pidx, jcampIdx: index }
          });

        case 18:
          minPeak = maxminPeak.min[pidx];
          _context.next = 21;
          return (0, _effects.put)({
            type: _action_type.CYCLIC_VOLTA_METRY.ADD_MIN_PEAK,
            payload: { peak: minPeak, index: pidx, jcampIdx: index }
          });

        case 21:
          pecker = maxminPeak.pecker[pidx];
          _context.next = 24;
          return (0, _effects.put)({
            type: _action_type.CYCLIC_VOLTA_METRY.ADD_PECKER,
            payload: { peak: pecker, index: pidx, jcampIdx: index }
          });

        case 24:
          pidx++;
          _context.next = 14;
          break;

        case 27:
          index++;
          _context.next = 8;
          break;

        case 30:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked);
}

var multiEntitiesSagas = [(0, _effects.takeEvery)(_action_type.CURVE.SET_ALL_CURVES, setCyclicVoltametry)];

exports.default = multiEntitiesSagas;