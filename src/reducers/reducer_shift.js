/* eslint-disable prefer-object-spread, default-param-last */
import {
  SHIFT, EDITPEAK, MANAGER, LAYOUT,
} from '../constants/action_type';
import { getListShift, LIST_SHIFT_1H } from '../constants/list_shift';
import { CalcResidualX, RealPts } from '../helpers/shift';

const shiftNone = LIST_SHIFT_1H[0];

// const initialState = {
//   ref: shiftNone,
//   peak: false,
//   enable: true,
// };

const initialState = {
  selectedIdx: 0,
  shifts: [
    {
      ref: shiftNone,
      peak: false,
      enable: true,
    },
  ],
};

const defaultEmptyShift = {
  ref: shiftNone,
  peak: false,
  enable: true,
};

const resetRef = (payload) => {
  const { shift, layout } = payload;
  if (!shift || !shift.solventName || !shift.solventValue) return shiftNone;

  const name = shift.solventName;
  let target = false;
  const listShift = getListShift(layout);
  listShift.forEach((l) => {
    if (l.name === name) {
      target = l;
    }
  });
  return target || shiftNone[0];
};

const resetEnable = (payload) => {
  const { typ } = payload.operation;
  switch (typ) {
    case 'NMR':
      return true;
    default:
      return false;
  }
};

const resetShift = (state, action) => {
  const { selectedIdx, shifts } = state;
  let selectedShift = shifts[selectedIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }

  const newShift = Object.assign(
    {},
    selectedShift,
    {
      ref: resetRef(action.payload),
      enable: resetEnable(action.payload),
    },
  );

  shifts[selectedIdx] = newShift;

  return Object.assign({}, state, { shifts, selectedIdx });
};

const updateShift = (state, action) => {  // eslint-disable-line
  const { selectedIdx, shifts } = state;
  let selectedShift = shifts[selectedIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }

  const newShift = Object.assign(
    {},
    selectedShift,
    {
      ref: false,
      enable: selectedShift.enable,
    },
  );

  shifts[selectedIdx] = newShift;

  return Object.assign({}, state, { shifts, selectedIdx });
};

const setRef = (state, action) => {
  const { payload } = action;
  const { dataToSet, curveIdx } = payload;
  const { shifts } = state;
  let selectedShift = shifts[curveIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }

  const newShift = Object.assign(
    {},
    selectedShift,
    {
      ref: dataToSet,
      enable: true,
    },
  );

  shifts[curveIdx] = newShift;

  return Object.assign({}, state, { shifts, selectedIdx: curveIdx });
};

const setPeak = (state, action) => {
  const { payload } = action;
  const { dataToSet, curveIdx } = payload;
  const { shifts } = state;
  let selectedShift = shifts[curveIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }

  const resX = CalcResidualX(
    selectedShift.ref,
    selectedShift.peak,
    dataToSet,
  );
  const trueApex = RealPts([dataToSet], resX)[0];
  const isSamePt = selectedShift.peak.x === trueApex.x;
  const truePeak = trueApex && trueApex.x && !isSamePt ? trueApex : false;

  const newShift = Object.assign(
    {},
    selectedShift,
    {
      peak: truePeak,
      enable: true,
    },
  );

  shifts[curveIdx] = newShift;

  return Object.assign({}, state, { shifts, selectedIdx: curveIdx });
};

const removePeak = (state, action) => { // eslint-disable-line
  const { selectedIdx, shifts } = state;
  let selectedShift = shifts[selectedIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }

  const newShift = Object.assign(
    {},
    selectedShift,
    {
      peak: false,
      enable: true,
    },
  );

  shifts[selectedIdx] = newShift;

  return Object.assign({}, state, { shifts, selectedIdx });
};

const addNegative = (state, action) => {
  const { payload } = action;
  const { dataToAdd, curveIdx } = payload;
  const { shifts } = state;

  let selectedShift = shifts[curveIdx];
  if (selectedShift === false || selectedShift === undefined) {
    selectedShift = defaultEmptyShift;
  }

  const rmApex = selectedShift.peak.x === dataToAdd.x;

  if (!rmApex) {
    return state;
  }
  const newShift = Object.assign(
    {},
    selectedShift,
    {
      peak: false,
      enable: true,
    },
  );

  shifts[curveIdx] = newShift;

  return Object.assign({}, state, { shifts, selectedIdx: curveIdx });
};

const shiftReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHIFT.SET_REF:
      return setRef(state, action);
    case SHIFT.SET_PEAK: {
      return setPeak(state, action);
    }
    case SHIFT.RM_PEAK:
      return removePeak(state, action);
    case EDITPEAK.ADD_NEGATIVE: {
      return addNegative(state, action);
    }
    case LAYOUT.UPDATE:
      return updateShift(initialState, action);
    case MANAGER.RESETSHIFT: // case MANAGER.RESETALL:
      return resetShift(initialState, action);
    default:
      return state;
  }
};

export default shiftReducer;
