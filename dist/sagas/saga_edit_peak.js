'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _effects = require('redux-saga/effects');

var _action_type = require('../constants/action_type');

var _shift = require('../helpers/shift');

var _marked = /*#__PURE__*/regeneratorRuntime.mark(addVirtualFactor);

var getShiftRef = function getShiftRef(state) {
  return state.shift.ref;
};
var getShiftPeak = function getShiftPeak(state) {
  return state.shift.peak;
};
var getEditPeak = function getEditPeak(state) {
  return state.editPeak.present;
};

function addVirtualFactor(action) {
  var origRef, origApex, origEPeak, payload, prevOffset, pos, neg, absOffset, relOffset, nextPos, nextNeg;
  return regeneratorRuntime.wrap(function addVirtualFactor$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.select)(getShiftRef);

        case 2:
          origRef = _context.sent;
          _context.next = 5;
          return (0, _effects.select)(getShiftPeak);

        case 5:
          origApex = _context.sent;
          _context.next = 8;
          return (0, _effects.select)(getEditPeak);

        case 8:
          origEPeak = _context.sent;
          payload = action.payload;
          prevOffset = origEPeak.prevOffset, pos = origEPeak.pos, neg = origEPeak.neg;
          absOffset = (0, _shift.FromManualToOffset)(origRef, origApex);
          relOffset = prevOffset - absOffset;
          nextPos = (0, _shift.VirtalPts)(pos, relOffset);
          nextNeg = (0, _shift.VirtalPts)(neg, relOffset);
          _context.next = 17;
          return (0, _effects.put)({
            type: _action_type.EDITPEAK.SHIFT,
            payload: Object.assign({}, payload, {
              prevOffset: absOffset,
              pos: nextPos,
              neg: nextNeg
            })
          });

        case 17:
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