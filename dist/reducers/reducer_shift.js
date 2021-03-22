'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _action_type = require('../constants/action_type');

var _list_shift = require('../constants/list_shift');

var _shift = require('../helpers/shift');

var shiftNone = _list_shift.LIST_SHIFT_1H[0];

var initialState = {
  ref: shiftNone,
  peak: false,
  enable: true
};

var resetRef = function resetRef(payload) {
  var shift = payload.shift,
      layout = payload.layout;

  if (!shift || !shift.solventName || !shift.solventValue) return shiftNone;

  var name = shift.solventName;
  var target = false;
  var listShift = (0, _list_shift.getListShift)(layout);
  listShift.forEach(function (l) {
    if (l.name === name) {
      target = l;
    }
  });
  return target || shiftNone[0];
};

var resetEnable = function resetEnable(payload) {
  var typ = payload.operation.typ;

  switch (typ) {
    case 'NMR':
      return true;
    default:
      return false;
  }
};

var shiftReducer = function shiftReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _action_type.SHIFT.SET_REF:
      return Object.assign({}, state, {
        ref: action.payload,
        enable: true
      });
    case _action_type.SHIFT.SET_PEAK:
      {
        var resX = (0, _shift.CalcResidualX)(state.ref, state.peak, action.payload);
        var trueApex = (0, _shift.RealPts)([action.payload], resX)[0];
        var isSamePt = state.peak.x === trueApex.x;
        var truePeak = trueApex && trueApex.x && !isSamePt ? trueApex : false;
        return Object.assign({}, state, {
          peak: truePeak,
          enable: true
        });
      }
    case _action_type.SHIFT.RM_PEAK:
      return Object.assign({}, state, {
        peak: false,
        enable: true
      });
    case _action_type.EDITPEAK.ADD_NEGATIVE:
      {
        var rmApex = state.peak.x === action.payload.x;
        return !rmApex ? state : Object.assign({}, state, {
          peak: false,
          enable: true
        });
      }
    case _action_type.LAYOUT.UPDATE:
      return Object.assign({}, initialState, {
        peak: false,
        enable: state.enable
      });
    case _action_type.MANAGER.RESETSHIFT:
      // case MANAGER.RESETALL:
      return Object.assign({}, initialState, {
        ref: resetRef(action.payload),
        enable: resetEnable(action.payload)
      });
    default:
      return state;
  }
};

exports.default = shiftReducer;