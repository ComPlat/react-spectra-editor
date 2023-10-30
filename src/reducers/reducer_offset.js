/* eslint-disable default-param-last */
import undoable from 'redux-undo';
import {
  UI, OFFSET, MANAGER,
} from '../constants/action_type';
import { undoRedoConfig, undoRedoActions } from './undo_redo_config';

const initialState = {
  selectedIdx: 0,
  offsets: [
    {
      stack: [],
      edited: false,
    },
  ],
};

const defaultEmptyOffset = {
  stack: [],
  edited: false,
};

const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

const calculateTmax = (xL, xU, data) => {
  const startIndex = data.findIndex((point) => point.x >= xL);
  const endIndex = data.findIndex((point) => point.x >= xU);

  if (startIndex === -1 || endIndex === -1) {
    return null;
  }

  const subset = data.slice(startIndex, endIndex + 1);

  const derivative = subset.map((point, index) => {
    if (index === 0 || index === subset.length - 1) {
      return 0;
    }
    const prev = subset[index - 1];
    const next = subset[index + 1];
    const dy = next.y - prev.y;
    const dx = next.x - prev.x;
    return dy / dx;
  });

  const tmaxIndex = derivative.findIndex((derivativeValue) => derivativeValue === 0);

  if (tmaxIndex !== -1) {
    return subset[tmaxIndex].x;
  }

  return null;
};

const addToStack = (state, action) => {
  const { newData, curveIdx } = action.payload;

  const { offsets } = state;
  let selectedOffset = offsets[curveIdx];

  if (selectedOffset === false || selectedOffset === undefined) {
    selectedOffset = defaultEmptyOffset;
  }

  const { stack } = selectedOffset;
  const { xExtent } = newData;
  const { xL, xU } = xExtent;

  if (!xL || !xU || (xU - xL) === 0) {
    return state;
  }

  const startIndex = newData.data.findIndex((point) => point.x >= xL);
  const endIndex = newData.data.findIndex((point) => point.x >= xU);

  if (startIndex === -1) {
    return state;
  }

  const yL = newData.data[startIndex].y;
  const yU = newData.data[endIndex].y;

  const difference = Math.abs(yL - yU);

  const tmax = calculateTmax(xL, xU, newData.data);

  const newStack = [...stack, {
    xL, xU, difference, tmax, yL, yU,
  }];

  newStack.sort((a, b) => a.xL - b.xL);

  const newSelectedOffset = { ...selectedOffset, stack: newStack };
  const newOffsets = [...offsets];
  newOffsets[curveIdx] = newSelectedOffset;

  return {
    ...state,
    offsets: newOffsets,
    selectedIdx: curveIdx,
  };
};

const clearAll = (state, action) => {
  const { payload } = action;
  const { curveIdx } = payload;
  const { offsets } = state;

  const newOffset = { ...defaultEmptyOffset, edited: true };
  const newArrOffset = [...offsets];
  newArrOffset[curveIdx] = newOffset;
  return { ...state, offsets: newArrOffset, selectedIdx: curveIdx };
};

const rmFromStack = (state, action) => {
  const { dataToRemove, curveIdx } = action.payload;
  const { offsets, selectedIdx } = state;

  if (selectedIdx !== curveIdx) {
    return state;
  }
  const selectedOffset = offsets[curveIdx];

  if (!selectedOffset) {
    return state;
  }

  const { stack } = selectedOffset;

  if (stack.length === 0) {
    return state;
  }

  const newStack = stack.filter((data) => !isEqual(data, dataToRemove));
  const newSelectedOffset = { ...selectedOffset, stack: newStack };
  const newOffsets = [...offsets];
  newOffsets[curveIdx] = newSelectedOffset;

  return {
    ...state,
    offsets: newOffsets,
  };
};

const offsetReducer = (state = initialState, action) => {
  switch (action.type) {
    case UI.SWEEP.SELECT_OFFSET:
      return addToStack(state, action);
    case OFFSET.RM_ONE:
      return rmFromStack(state, action);
    case OFFSET.CLEAR_ALL:
      return clearAll(state, action);
    case MANAGER.RESETALL:
      return state;
    default:
      return undoRedoActions.indexOf(action.type) >= 0
        ? ({ ...state })
        : state;
  }
};

const undoableOffsetReducer = undoable(
  offsetReducer,
  undoRedoConfig,
);

export default undoableOffsetReducer;
