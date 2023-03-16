'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _action_type = require('../constants/action_type');

var _list_shift = require('../constants/list_shift');

var _shift = require('../helpers/shift');

var shiftNone = _list_shift.LIST_SHIFT_1H[0];

// const initialState = {
//   ref: shiftNone,
//   peak: false,
//   enable: true,
// };

var initialState = {
  selectedIdx: 0,
  shifts: [{
    ref: shiftNone,
    peak: false,
    enable: true
  }]
};

var defaultEmptyShift = {
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

var resetShift = function resetShift(state, action) {
  var selectedIdx = state.selectedIdx,
      shifts = state.shifts;

  var selectedShift = shifts[selectedIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }

  var newShift = Object.assign({}, selectedShift, {
    ref: resetRef(action.payload),
    enable: resetEnable(action.payload)
  });

  shifts[selectedIdx] = newShift;

  return Object.assign({}, state, { shifts: shifts, selectedIdx: selectedIdx });
};

var updateShift = function updateShift(state, action) {
  var selectedIdx = state.selectedIdx,
      shifts = state.shifts;

  var selectedShift = shifts[selectedIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }

  var newShift = Object.assign({}, selectedShift, {
    ref: false,
    enable: selectedShift.enable
  });

  shifts[selectedIdx] = newShift;

  return Object.assign({}, state, { shifts: shifts, selectedIdx: selectedIdx });
};

var setRef = function setRef(state, action) {
  var payload = action.payload;
  var dataToSet = payload.dataToSet,
      curveIdx = payload.curveIdx;
  var shifts = state.shifts;

  var selectedShift = shifts[curveIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }

  var newShift = Object.assign({}, selectedShift, {
    ref: dataToSet,
    enable: true
  });

  shifts[curveIdx] = newShift;

  return Object.assign({}, state, { shifts: shifts, selectedIdx: curveIdx });
};

var setPeak = function setPeak(state, action) {
  var payload = action.payload;
  var dataToSet = payload.dataToSet,
      curveIdx = payload.curveIdx;
  var shifts = state.shifts;

  var selectedShift = shifts[curveIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }

  var resX = (0, _shift.CalcResidualX)(selectedShift.ref, selectedShift.peak, dataToSet);
  var trueApex = (0, _shift.RealPts)([dataToSet], resX)[0];
  var isSamePt = selectedShift.peak.x === trueApex.x;
  var truePeak = trueApex && trueApex.x && !isSamePt ? trueApex : false;

  var newShift = Object.assign({}, selectedShift, {
    peak: truePeak,
    enable: true
  });

  shifts[curveIdx] = newShift;

  return Object.assign({}, state, { shifts: shifts, selectedIdx: curveIdx });
};

var removePeak = function removePeak(state, action) {
  var selectedIdx = state.selectedIdx,
      shifts = state.shifts;

  var selectedShift = shifts[selectedIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }

  var newShift = Object.assign({}, selectedShift, {
    peak: false,
    enable: true
  });

  shifts[selectedIdx] = newShift;

  return Object.assign({}, state, { shifts: shifts, selectedIdx: selectedIdx });
};

var addNegative = function addNegative(state, action) {
  var payload = action.payload;
  var dataToAdd = payload.dataToAdd,
      curveIdx = payload.curveIdx;
  var shifts = state.shifts;


  var selectedShift = shifts[curveIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }

  var rmApex = selectedShift.peak.x === dataToAdd.x;

  if (!rmApex) {
    return state;
  } else {
    var newShift = Object.assign({}, selectedShift, {
      peak: false,
      enable: true
    });

    shifts[curveIdx] = newShift;

    return Object.assign({}, state, { shifts: shifts, selectedIdx: curveIdx });
  }
};

var shiftReducer = function shiftReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case _action_type.SHIFT.SET_REF:
      return setRef(state, action);
    case _action_type.SHIFT.SET_PEAK:
      {
        return setPeak(state, action);
      }
    case _action_type.SHIFT.RM_PEAK:
      return removePeak(state, action);
    case _action_type.EDITPEAK.ADD_NEGATIVE:
      {
        return addNegative(state, action);
      }
    case _action_type.LAYOUT.UPDATE:
      return updateShift(initialState, action);
    case _action_type.MANAGER.RESETSHIFT:
      // case MANAGER.RESETALL:
      return resetShift(initialState, action);
    default:
      return state;
  }
};

exports.default = shiftReducer;