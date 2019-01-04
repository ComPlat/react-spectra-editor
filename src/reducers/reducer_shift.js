import { SHIFT, EDITPEAK, MANAGER } from '../constants/action_type';
import LIST_SHIFT from '../constants/list_shift';
import { CalcResidualX, RealPts } from '../helpers/shift';

const initialState = {
  ref: LIST_SHIFT[0],
  peak: false,
  enable: true,
};

const resetEnable = (operation) => {
  const { typ } = operation;
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
    case MANAGER.RESETALL:
      return Object.assign(
        {},
        initialState,
        {
          enable: resetEnable(action.payload),
        },
      );
    default:
      return state;
  }
};

export default shiftReducer;
