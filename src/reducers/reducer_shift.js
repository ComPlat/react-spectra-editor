import { SHIFT, EDITPEAK, MANAGER } from '../constants/action_type';
import LIST_SHIFT from '../constants/list_shift';

const initialState = {
  ref: LIST_SHIFT[0],
  peak: false,
  enable: true,
};

const adjustPeak = (origState, newPeak) => {
  if (!newPeak || origState.ref.name === LIST_SHIFT[0].name) return newPeak;
  const oldPeakX = origState.peak ? origState.peak.x : 0.0;
  const adjust = oldPeakX === 0.0 ? 0.0 : origState.ref.value;
  return {
    x: newPeak.x + oldPeakX - adjust,
    y: newPeak.y,
  };
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
      const adjust = adjustPeak(state, action.payload);
      const isMatch = state.peak.x === adjust.x;
      const result = isMatch ? false : adjust;
      return Object.assign(
        {},
        state,
        {
          peak: result,
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
      const isMatch = state.peak.x === action.payload.x;
      return !isMatch
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
