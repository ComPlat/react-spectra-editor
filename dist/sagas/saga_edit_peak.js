"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _effects = require("redux-saga/effects");
var _action_type = require("../constants/action_type");
var _shift = require("../helpers/shift");
var _list_shift = require("../constants/list_shift");
const getShift = state => state.shift;
const getEditPeak = state => state.editPeak.present;
function* addVirtualFactor(action) {
  const originShift = yield (0, _effects.select)(getShift);
  const origEPeak = yield (0, _effects.select)(getEditPeak);
  const {
    payload
  } = action;
  const {
    curveIdx
  } = payload;
  const {
    peaks
  } = origEPeak;
  let currentOriginPeaks = peaks[curveIdx];
  if (currentOriginPeaks === false || currentOriginPeaks === undefined) {
    currentOriginPeaks = {
      prevOffset: 0,
      pos: [],
      neg: []
    };
  }
  let currentOriginShift = originShift.shifts[curveIdx];
  if (currentOriginShift === false || currentOriginShift === undefined) {
    const shiftNone = _list_shift.LIST_SHIFT_1H[0];
    currentOriginShift = {
      ref: shiftNone,
      peak: false,
      enable: true
    };
  }
  const origRef = currentOriginShift.ref;
  const origApex = currentOriginShift.peak;
  const {
    prevOffset,
    pos,
    neg
  } = currentOriginPeaks;
  const absOffset = (0, _shift.FromManualToOffset)(origRef, origApex);
  const relOffset = prevOffset - absOffset;
  const nextPos = (0, _shift.VirtalPts)(pos, relOffset);
  const nextNeg = (0, _shift.VirtalPts)(neg, relOffset);
  yield (0, _effects.put)({
    type: _action_type.EDITPEAK.SHIFT,
    payload: Object.assign({}, payload, {
      // eslint-disable-line
      prevOffset: absOffset,
      pos: nextPos,
      neg: nextNeg
    })
  });
}
const editPeakSagas = [(0, _effects.takeEvery)(_action_type.SHIFT.SET_REF, addVirtualFactor), (0, _effects.takeEvery)(_action_type.SHIFT.SET_PEAK, addVirtualFactor)];
var _default = editPeakSagas;
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
exports.default = _default;