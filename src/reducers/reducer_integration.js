/* eslint-disable prefer-object-spread, default-param-last */
import undoable from 'redux-undo';
import {
  UI, INTEGRATION, EDITPEAK, MANAGER,
} from '../constants/action_type';
import { getArea, getAbsoluteArea } from '../helpers/integration';
import { undoRedoConfig, undoRedoActions } from './undo_redo_config';

const initialState = {
  selectedIdx: 0,
  integrations: [
    {
      stack: [],
      refArea: 1,
      refFactor: 1,
      shift: 0,
      edited: false,
    },
  ],
};

const defaultEmptyIntegration = {
  stack: [],
  refArea: 1,
  refFactor: 1,
  shift: 0,
  edited: false,
};

const addToStack = (state, action) => {
  const { newData, curveIdx } = action.payload;

  const { integrations } = state;
  let selectedIntegration = integrations[curveIdx];
  if (selectedIntegration === false || selectedIntegration === undefined) {
    selectedIntegration = defaultEmptyIntegration;
  }

  const { stack, refArea, shift } = selectedIntegration;
  const { xExtent, data } = newData;
  const { xL, xU } = xExtent;
  if (!xL || !xU || (xU - xL) === 0) { return state; }

  const area = getArea(xL, xU, data);
  const defaultRefArea = stack.length === 0 ? area : refArea;
  const absoluteArea = getAbsoluteArea(xL, xU, data); // area depends on y baseline
  const newStack = [...stack,
    {
      xL: xL + shift, xU: xU + shift, area, absoluteArea,
    },
  ];

  const newIntegration = Object.assign(
    {},
    selectedIntegration,
    { stack: newStack, refArea: defaultRefArea },
  );
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;

  return Object.assign({}, state, { integrations: newArrIntegration, selectedIdx: curveIdx });
};

const rmFromStack = (state, action) => {
  const { dataToRemove, curveIdx } = action.payload;
  const { xL, xU, xExtent } = dataToRemove;

  const { integrations } = state;
  const selectedIntegration = integrations[curveIdx];

  const { stack } = selectedIntegration;

  let [txL, txU] = [0, 0];
  if (xL && xU) { // rm click integration
    [txL, txU] = [xL, xU];
  } else if (xExtent) { // rm click multiplicity
    [txL, txU] = [xExtent.xL, xExtent.xU];
  } else {
    return state;
  }
  const newStack = stack.filter((k) => k.xL !== txL && k.xU !== txU);

  const newIntegration = Object.assign({}, selectedIntegration, { stack: newStack });
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;

  return Object.assign({}, state, { integrations: newArrIntegration, selectedIdx: curveIdx });
};

const setRef = (state, action) => {
  const { refData, curveIdx } = action.payload;

  const { integrations } = state;
  const selectedIntegration = integrations[curveIdx];

  const { stack } = selectedIntegration;

  const { xL, xU } = refData;
  const ref = stack.filter((k) => k.xL === xL && k.xU === xU)[0];
  if (!ref) {
    return state;
  }
  const refArea = ref.area;

  const newIntegration = Object.assign({}, selectedIntegration, { refArea });
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;

  return Object.assign({}, state, { integrations: newArrIntegration, selectedIdx: curveIdx });
};

const setFkr = (state, action) => {
  const { payload } = action;
  const { curveIdx, factor } = payload;
  const { integrations } = state;
  const selectedIntegration = integrations[curveIdx];

  const val = parseFloat(factor);
  const refFactor = val < 0.01 ? 0.01 : val;

  const newIntegration = Object.assign({}, selectedIntegration, { refFactor });
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;

  return Object.assign({}, state, { integrations: newArrIntegration });
};

const setShift = (state, action) => {
  const { selectedIdx, integrations } = state;
  const selectedIntegration = integrations[selectedIdx];

  const shift = action.payload.prevOffset;

  const newIntegration = Object.assign({}, selectedIntegration, { shift });
  const newArrIntegration = [...integrations];
  newArrIntegration[selectedIdx] = newIntegration;
  return Object.assign({}, state, { integrations: newArrIntegration });
};

const resetAll = (state, action) => {
  const newState = action.payload;
  return Object.assign({}, state, newState);
};

const clearAll = (state, action) => {
  const { payload } = action;
  const { curveIdx } = payload;
  const { integrations } = state;

  const newIntegration = Object.assign({}, defaultEmptyIntegration, { edited: true });
  const newArrIntegration = [...integrations];
  newArrIntegration[curveIdx] = newIntegration;
  return Object.assign({}, state, { integrations: newArrIntegration, selectedIdx: curveIdx });
};

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
      return clearAll(state, action);
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
