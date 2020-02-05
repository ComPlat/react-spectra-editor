import {
  SHIFT, EDITPEAK, MANAGER, LAYOUT,
} from '../constants/action_type';
import { getListShift, LIST_SHIFT_1H } from '../constants/list_shift';
import { CalcResidualX, RealPts } from '../helpers/shift';

const shiftNone = LIST_SHIFT_1H[0];

const initialState = {
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

const shiftReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHIFT.SET_REF:
      return Object.assign(
        {},
        state,
        {
          ref: action.payload,
          enable: true,
        },
      );
    case SHIFT.SET_PEAK: {
      const resX = CalcResidualX(
        state.ref,
        state.peak,
        action.payload,
      );
      const trueApex = RealPts([action.payload], resX)[0];
      const isSamePt = state.peak.x === trueApex.x;
      const truePeak = trueApex && trueApex.x && !isSamePt ? trueApex : false;
      return Object.assign(
        {},
        state,
        {
          peak: truePeak,
          enable: true,
        },
      );
    }
    case SHIFT.RM_PEAK:
      return Object.assign(
        {},
        state,
        {
          peak: false,
          enable: true,
        },
      );
    case EDITPEAK.ADD_NEGATIVE: {
      const rmApex = state.peak.x === action.payload.x;
      return !rmApex
        ? state
        : Object.assign(
          {},
          state,
          {
            peak: false,
            enable: true,
          },
        );
    }
    case LAYOUT.UPDATE:
      return Object.assign(
        {},
        initialState,
        {
          peak: false,
          enable: state.enable,
        },
      );
    case MANAGER.RESETSHIFT: // case MANAGER.RESETALL:
      return Object.assign(
        {},
        initialState,
        {
          ref: resetRef(action.payload),
          enable: resetEnable(action.payload),
        },
      );
    default:
      return state;
  }
};

export default shiftReducer;
