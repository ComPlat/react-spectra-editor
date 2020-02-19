import undoable from 'redux-undo';
import {
  UI, EDITPEAK, INTEGRATION, MULTIPLICITY, MANAGER,
} from '../constants/action_type';

import { undoRedoConfig, undoRedoActions } from './undo_redo_config';

const initialState = {
  stack: [],
  shift: 0,
  smExtext: false,
  edited: false,
};

const setShift = (state, action) => {
  const shift = action.payload.prevOffset;
  return Object.assign({}, state, { shift });
};

const rmFromStack = (state, action) => {
  const { stack } = state;
  const { xL, xU, xExtent } = action.payload;
  let [txL, txU] = [0, 0];
  if (xL && xU) { // rm click integration
    [txL, txU] = [xL, xU];
  } else if (xExtent) { // rm click multiplicity
    [txL, txU] = [xExtent.xL, xExtent.xU];
  } else {
    return state;
  }
  const newStack = stack.filter((k) => {
    const [kxL, kxU] = [k.xExtent.xL, k.xExtent.xU];
    return kxL !== txL && kxU !== txU;
  });
  const newSmExtext = newStack[0] ? newStack[0].xExtent : false;
  return Object.assign({}, state, { stack: newStack, smExtext: newSmExtext });
};

const selectMpyType = (state, action) => {
  const { mpyType, xExtent } = action.payload;
  const { stack } = state;
  const newStack = stack.map((k) => {
    if (k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU) {
      return Object.assign({}, k, { mpyType });
    }
    return k;
  });
  return Object.assign({}, state, { stack: newStack });
};

const updateMpyJ = (state, action) => {
  const { payload } = action;
  const { xExtent, value } = payload;
  if (!value) return state;
  const { stack } = state;
  const regx = /[^0-9.,-]/g;
  const js = value.replace(regx, '').split(',').map(j => parseFloat(j)).filter(j => j);

  const newStack = stack.map((k) => {
    if (k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU) {
      return Object.assign({}, k, { js });
    }
    return k;
  });
  return Object.assign({}, state, { stack: newStack });
};

const clickMpyOne = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, { smExtext: payload });
};

const clearAll = () => (
  Object.assign({}, initialState, { edited: true })
);

const multiplicityReducer = (state = initialState, action) => {
  switch (action.type) {
    case EDITPEAK.SHIFT:
      return setShift(state, action);
    case INTEGRATION.RM_ONE:
      return rmFromStack(state, action);
    case UI.SWEEP.SELECT_MULTIPLICITY_RDC:
    case MULTIPLICITY.PEAK_RM_BY_PANEL_RDC:
    case MULTIPLICITY.PEAK_RM_BY_UI_RDC:
    case MULTIPLICITY.PEAK_ADD_BY_UI_RDC:
    case MULTIPLICITY.RESET_ONE_RDC:
      return action.payload;
    case MULTIPLICITY.UPDATE_J:
      return updateMpyJ(state, action);
    case MULTIPLICITY.TYPE_SELECT:
      return selectMpyType(state, action);
    case MULTIPLICITY.ONE_CLICK:
    case MULTIPLICITY.ONE_CLICK_BY_UI:
      return clickMpyOne(state, action);
    case MULTIPLICITY.RESET_ALL_RDC:
      return action.payload;
    case MULTIPLICITY.CLEAR_ALL:
      return clearAll();
    case MANAGER.RESETALL:
      return state;
    default:
      return undoRedoActions.indexOf(action.type)
        ? Object.assign({}, state)
        : state;
  }
};

const undoableMultiplicityReducer = undoable(
  multiplicityReducer,
  undoRedoConfig,
);

export default undoableMultiplicityReducer;
