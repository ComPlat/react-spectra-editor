'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _effects = require('redux-saga/effects');

var _action_type = require('../constants/action_type');

var _shift = require('../helpers/shift');

var _list_shift = require('../constants/list_shift');

var _marked = /*#__PURE__*/regeneratorRuntime.mark(addVirtualFactor);

var getShift = function getShift(state) {
  return state.shift;
};
var getEditPeak = function getEditPeak(state) {
  return state.editPeak.present;
};

function addVirtualFactor(action) {
  var originShift, origEPeak, payload, curveIdx, peaks, currentOriginPeaks, currentOriginShift, shiftNone, origRef, origApex, _currentOriginPeaks, prevOffset, pos, neg, absOffset, relOffset, nextPos, nextNeg;

  return regeneratorRuntime.wrap(function addVirtualFactor$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.select)(getShift);

        case 2:
          originShift = _context.sent;
          _context.next = 5;
          return (0, _effects.select)(getEditPeak);

        case 5:
          origEPeak = _context.sent;
          payload = action.payload;
          curveIdx = payload.curveIdx;
          peaks = origEPeak.peaks;
          currentOriginPeaks = peaks[curveIdx];

          if (currentOriginPeaks === false || currentOriginPeaks === undefined) {
            currentOriginPeaks = {
              prevOffset: 0,
              pos: [],
              neg: []
            };
          }

          currentOriginShift = originShift[curveIdx];

          if (currentOriginShift === false || currentOriginShift === undefined) {
            shiftNone = _list_shift.LIST_SHIFT_1H[0];

            currentOriginShift = {
              ref: shiftNone,
              peak: false,
              enable: true
            };
          }

          origRef = currentOriginShift.ref;
          origApex = currentOriginShift.peak;
          _currentOriginPeaks = currentOriginPeaks, prevOffset = _currentOriginPeaks.prevOffset, pos = _currentOriginPeaks.pos, neg = _currentOriginPeaks.neg;
          absOffset = (0, _shift.FromManualToOffset)(origRef, origApex);
          relOffset = prevOffset - absOffset;
          nextPos = (0, _shift.VirtalPts)(pos, relOffset);
          nextNeg = (0, _shift.VirtalPts)(neg, relOffset);
          _context.next = 22;
          return (0, _effects.put)({
            type: _action_type.EDITPEAK.SHIFT,
            payload: Object.assign({}, payload, {
              prevOffset: absOffset,
              pos: nextPos,
              neg: nextNeg
            })
          });

        case 22:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked);
}

var editPeakSagas = [(0, _effects.takeEvery)(_action_type.SHIFT.SET_REF, addVirtualFactor), (0, _effects.takeEvery)(_action_type.SHIFT.SET_PEAK, addVirtualFactor)];

exports.default = editPeakSagas;

/* LOGIC
                                      -no        po - tg
  | picked | another | absoffset | prevOffset | relative | newOffset
-------------------------------------------------------------------
0 |   40        20          -           -            -          0
1 |  180       160       -140           0          140        140
2 |   80        60        -40        -140         -100        100
3 |   20         0        +20        -100         -120
-------------------------------------------------------------------

*/