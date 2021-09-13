import undoable from 'redux-undo';
import {
  UI, INTEGRATION, EDITPEAK, MANAGER,
} from '../constants/action_type';
import { getArea, getAbsoluteArea } from '../helpers/integration';
import { undoRedoConfig, undoRedoActions } from './undo_redo_config';

const initialState = {
  stack: [],
  refArea: 1,
  refFactor: 1,
  shift: 0,
  edited: false,
};

const addToStack = (state, action) => {
  const { stack, refArea, shift } = state;
  const { xExtent, data } = action.payload;
  const { xL, xU } = xExtent;
  if (!xL || !xU || (xU - xL) === 0) { return state; }
  const area = getArea(xL, xU, data);
  const defaultRefArea = stack.length === 0 ? area : refArea;
  const absoluteArea = getAbsoluteArea(xL, xU, data); //area depends on y baseline
  const newStack = [...stack, { xL: xL + shift, xU: xU + shift, area, absoluteArea }];
  return Object.assign({}, state, { stack: newStack, refArea: defaultRefArea });
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
  const newStack = stack.filter(k => k.xL !== txL && k.xU !== txU);
  return Object.assign({}, state, { stack: newStack });
};

const setRef = (state, action) => {
  const { stack } = state;
  const { xL, xU } = action.payload;
  const ref = stack.filter(k => k.xL === xL && k.xU === xU)[0];
  const refArea = ref.area;
  return Object.assign({}, state, { refArea });
};

const setFkr = (state, action) => {
  const val = parseFloat(action.payload);
  const refFactor = val < 0.01 ? 0.01 : val;
  return Object.assign({}, state, { refFactor });
};

const setShift = (state, action) => {
  const shift = action.payload.prevOffset;
  return Object.assign({}, state, { shift });
};

const resetAll = (state, action) => {
  const newState = action.payload;
  return Object.assign({}, state, newState);
};

const clearAll = () => (
  Object.assign({}, initialState, { edited: true })
);

const integrationReducer = (state = initialState, action) => {
  switch (action.type) {
    case UI.SWEEP.SELECT_INTEGRATION:
      return addToStack(state, action);
    case INTEGRATION.RM_ONE:
      return rmFromStack(state, action);
    case INTEGRATION.SET_REF:
      return setRef(state, action);
    case INTEGRATION.SET_FKR:
      return setFkr(state, action);
    case INTEGRATION.RESET_ALL_RDC:
      return resetAll(state, action);
    case INTEGRATION.CLEAR_ALL:
      return clearAll();
    case EDITPEAK.SHIFT:
      return setShift(state, action);
    case MANAGER.RESETALL:
      return state;
    default:
      return undoRedoActions.indexOf(action.type) >= 0
        ? Object.assign({}, state)
        : state;
  }
};

const undoableIntegrationReducer = undoable(
  integrationReducer,
  undoRedoConfig,
);

export default undoableIntegrationReducer;
