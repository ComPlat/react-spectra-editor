import {
  UI, EDITPEAK, INTEGRATION, MULTIPLICITY, MANAGER,
} from '../constants/action_type';
import { calcMpyType } from '../helpers/calc';

const initialState = {
  stack: [],
  shift: 0,
  smExtext: false,
};

const addToStack = (state, action) => {
  const { xExtent, yExtent, dataPks } = action.payload;
  const { shift } = state;
  const { xL, xU } = xExtent;
  const { yL, yU } = yExtent;
  let peaks = dataPks.filter(p => xL <= p.x && p.x <= xU && yL <= p.y && p.y <= yU);
  peaks = peaks.map(pk => ({ x: pk.x + shift, y: pk.y }));
  const newXExtemt = { xL: xL + shift, xU: xU + shift };
  const m = {
    peaks,
    xExtent: newXExtemt,
    yExtent,
    mpyType: calcMpyType(peaks),
  };
  const { stack } = state;
  const newStack = [...stack, m];
  return Object.assign({}, state, { stack: newStack, smExtext: newXExtemt });
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

const rmPanelPeakFromStack = (state, action) => {
  const { peak, xExtent } = action.payload;
  const { stack } = state;
  let newStack = stack.map((k) => {
    if (k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU) {
      const newPks = k.peaks.filter(pk => pk.x !== peak.x);
      const mpyType = calcMpyType(newPks);
      return Object.assign({}, k, { peaks: newPks, mpyType });
    }
    return k;
  });
  newStack = newStack.filter(k => k.peaks.length !== 0);
  if (newStack.length === 0) return Object.assign({}, state, { stack: newStack, smExtext: false });
  const noSmExtext = newStack.map(k => (
    (k.xExtent.xL === xExtent.xL && k.xExtent.xU === xExtent.xU) ? 1 : 0
  )).reduce((a, s) => a + s) === 0;
  const newSmExtext = noSmExtext ? newStack[0].xExtent : xExtent;
  return Object.assign({}, state, { stack: newStack, smExtext: newSmExtext });
};

const rmUiPeakFromStack = (state, action) => {
  const peak = action.payload;
  const xExtent = state.smExtext;
  const newAction = Object.assign({}, action, { payload: { peak, xExtent } });
  return rmPanelPeakFromStack(state, newAction);
};

const AddUiPeakToStack = (state, action) => {
  const { shift } = state;
  let { x, y } = action.payload; // eslint-disable-line
  if (!x || !y) return state;
  x += shift;
  const newPeak = { x, y };
  const { stack, smExtext } = state;
  const { xL, xU } = smExtext;
  if (x < xL || xU < x) return state;
  const newStack = stack.map((k) => {
    if (k.xExtent.xL === xL && k.xExtent.xU === xU) {
      const existXs = k.peaks.map(pk => pk.x);
      if (existXs.indexOf(newPeak.x) >= 0) return k;
      const newPks = [...k.peaks, newPeak];
      const mpyType = calcMpyType(newPks);
      return Object.assign({}, k, { peaks: newPks, mpyType });
    }
    return k;
  });
  return Object.assign({}, state, { stack: newStack });
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

const clickMpyOne = (state, action) => {
  const { payload } = action;
  return Object.assign({}, state, { smExtext: payload });
};

const resetAll = (state, action) => {
  const newState = action.payload;
  return Object.assign({}, state, newState);
};

const multiplicityReducer = (state = initialState, action) => {
  switch (action.type) {
    case UI.SWEEP.SELECT_MULTIPLICITY:
      return addToStack(state, action);
    case EDITPEAK.SHIFT:
      return setShift(state, action);
    case INTEGRATION.RM_ONE:
      return rmFromStack(state, action);
    case MULTIPLICITY.PEAK_RM_BY_PANEL:
      return rmPanelPeakFromStack(state, action);
    case MULTIPLICITY.PEAK_RM_BY_UI:
      return rmUiPeakFromStack(state, action);
    case MULTIPLICITY.PEAK_ADD_BY_UI:
      return AddUiPeakToStack(state, action);
    case MULTIPLICITY.TYPE_SELECT:
      return selectMpyType(state, action);
    case MULTIPLICITY.ONE_CLICK:
    case MULTIPLICITY.ONE_CLICK_BY_UI:
      return clickMpyOne(state, action);
    case MULTIPLICITY.RESET_ALL:
      return resetAll(state, action);
    case MANAGER.RESETALL:
      return state;
    default:
      return state;
  }
};

export default multiplicityReducer;
