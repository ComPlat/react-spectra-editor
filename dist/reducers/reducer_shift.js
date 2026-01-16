"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
var _list_shift = require("../constants/list_shift");
var _shift = require("../helpers/shift");
/* eslint-disable prefer-object-spread, default-param-last */

const shiftNone = _list_shift.LIST_SHIFT_1H[0];

// const initialState = {
//   ref: shiftNone,
//   peak: false,
//   enable: true,
// };

const initialState = {
  selectedIdx: 0,
  shifts: [{
    ref: shiftNone,
    peak: false,
    enable: true
  }]
};
const defaultEmptyShift = {
  ref: shiftNone,
  peak: false,
  enable: true
};
const resetRef = payload => {
  const {
    shift,
    layout
  } = payload;
  if (!shift || !shift.solventName || !shift.solventValue) return shiftNone;
  const name = shift.solventName;
  let target = false;
  const listShift = (0, _list_shift.getListShift)(layout);
  listShift.forEach(l => {
    if (l.name === name) {
      target = l;
    }
  });
  return target || shiftNone[0];
};
const resetEnable = payload => {
  const {
    typ
  } = payload.operation;
  switch (typ) {
    case 'NMR':
      return true;
    default:
      return false;
  }
};
const resetShift = (state, action) => {
  const {
    payload
  } = action;
  const {
    curvesInfo
  } = payload;
  const {
    isMultiCurve,
    curveIdx,
    numberOfCurve
  } = curvesInfo;
  const {
    shifts
  } = state;
  let selectedShift = shifts[curveIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }
  if (isMultiCurve) {
    for (let idx = 0; idx < numberOfCurve; idx += 1) {
      const checkShift = shifts[idx];
      if (!checkShift) {
        shifts[idx] = defaultEmptyShift;
      }
    }
  }
  const newShift = Object.assign({}, defaultEmptyShift, {
    ref: resetRef(payload),
    enable: resetEnable(payload)
  });
  shifts[curveIdx] = newShift;
  return Object.assign({}, state, {
    shifts,
    selectedIdx: curveIdx
  });
};
const updateShift = (state, action) => {
  // eslint-disable-line
  const {
    selectedIdx,
    shifts
  } = state;
  let selectedShift = shifts[selectedIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }
  const newShift = Object.assign({}, selectedShift, {
    ref: false,
    enable: selectedShift.enable
  });
  shifts[selectedIdx] = newShift;
  return Object.assign({}, state, {
    shifts,
    selectedIdx
  });
};
const setRef = (state, action) => {
  const {
    payload
  } = action;
  const {
    dataToSet,
    curveIdx
  } = payload;
  const {
    shifts
  } = state;
  let selectedShift = shifts[curveIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }
  const newShift = Object.assign({}, selectedShift, {
    ref: dataToSet,
    enable: true
  });
  shifts[curveIdx] = newShift;
  return Object.assign({}, state, {
    shifts,
    selectedIdx: curveIdx
  });
};
const setPeak = (state, action) => {
  const {
    payload
  } = action;
  const {
    dataToSet,
    curveIdx
  } = payload;
  const {
    shifts
  } = state;
  let selectedShift = shifts[curveIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }
  const resX = (0, _shift.CalcResidualX)(selectedShift.ref, selectedShift.peak, dataToSet);
  const trueApex = (0, _shift.RealPts)([dataToSet], resX)[0];
  const isSamePt = selectedShift.peak.x === trueApex.x;
  const truePeak = trueApex && trueApex.x && !isSamePt ? trueApex : false;
  const newShift = Object.assign({}, selectedShift, {
    peak: truePeak,
    enable: true
  });
  shifts[curveIdx] = newShift;
  return Object.assign({}, state, {
    shifts,
    selectedIdx: curveIdx
  });
};
const removePeak = (state, action) => {
  // eslint-disable-line
  const {
    selectedIdx,
    shifts
  } = state;
  let selectedShift = shifts[selectedIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }
  const newShift = Object.assign({}, selectedShift, {
    peak: false,
    enable: true
  });
  shifts[selectedIdx] = newShift;
  return Object.assign({}, state, {
    shifts,
    selectedIdx
  });
};
const addNegative = (state, action) => {
  const {
    payload
  } = action;
  const {
    dataToAdd,
    curveIdx
  } = payload;
  const {
    shifts
  } = state;
  let selectedShift = shifts[curveIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }
  const rmApex = selectedShift.peak.x === dataToAdd.x;
  if (!rmApex) {
    return state;
  }
  const newShift = Object.assign({}, selectedShift, {
    peak: false,
    enable: true
  });
  shifts[curveIdx] = newShift;
  return Object.assign({}, state, {
    shifts,
    selectedIdx: curveIdx
  });
};
const shiftReducer = (state = initialState, action) => {
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
var _default = exports.default = shiftReducer;