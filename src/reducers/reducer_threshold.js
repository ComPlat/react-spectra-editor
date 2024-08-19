/* eslint-disable prefer-object-spread, default-param-last */
import { THRESHOLD, MANAGER, CURVE } from '../constants/action_type';

const initialState = {
  selectedIdx: 0,
  list: [
    {
      isEdit: true,
      value: false,
      upper: false,
      lower: false,
    },
  ],
};

// const defaultThresHold = {
//   isEdit: true,
//   value: false,
//   upper: false,
//   lower: false,
// };

const setThresHoldValue = (state, action) => {
  const { payload } = action;
  const { list, selectedIdx } = state;
  if (payload) {
    const { value, curveIdx } = payload;
    const selectedThres = list[curveIdx];
    const newSelectedThres = Object.assign({}, selectedThres, { value });
    const newListThres = [...list];
    newListThres[curveIdx] = newSelectedThres;
    return Object.assign({}, state, { list: newListThres, selectedIdx: curveIdx });
  }

  const selectedThres = list[selectedIdx];
  const newSelectedThres = Object.assign({}, selectedThres, { value: payload });
  const newListThres = [...list];
  newListThres[selectedIdx] = newSelectedThres;
  return Object.assign({}, state, { list: newListThres });
};

const setThresHoldUpper = (state, action) => {
  const { payload } = action;
  const { list, selectedIdx } = state;
  if (payload) {
    const { value, curveIdx } = payload;
    const selectedThres = list[curveIdx];
    const newSelectedThres = Object.assign({}, selectedThres, { upper: value });
    const newListThres = [...list];
    newListThres[curveIdx] = newSelectedThres;
    return Object.assign({}, state, { list: newListThres, selectedIdx: curveIdx });
  }

  const selectedThres = list[selectedIdx];
  const newSelectedThres = Object.assign({}, selectedThres, { upper: payload });
  const newListThres = [...list];
  newListThres[selectedIdx] = newSelectedThres;
  return Object.assign({}, state, { list: newListThres });
};

const setThresHoldLower = (state, action) => {
  const { payload } = action;
  const { list, selectedIdx } = state;
  if (payload) {
    const { value, curveIdx } = payload;
    const selectedThres = list[curveIdx];
    const newSelectedThres = Object.assign({}, selectedThres, { lower: value });
    const newListThres = [...list];
    newListThres[curveIdx] = newSelectedThres;
    return Object.assign({}, state, { list: newListThres, selectedIdx: curveIdx });
  }

  const selectedThres = list[selectedIdx];
  const newSelectedThres = Object.assign({}, selectedThres, { lower: payload });
  const newListThres = [...list];
  newListThres[selectedIdx] = newSelectedThres;
  return Object.assign({}, state, { list: newListThres });
};

const setThresHoldIsEdit = (state) => {
  const { list, selectedIdx } = state;
  const selectedThres = list[selectedIdx];
  const { isEdit } = selectedThres;
  const newSelectedThres = Object.assign({}, selectedThres, { isEdit: !isEdit });
  const newListThres = [...list];
  newListThres[selectedIdx] = newSelectedThres;
  return Object.assign({}, state, { list: newListThres });
};

const resetAll = (state, action) => {
  const { payload } = action;
  const { list } = state;
  const newList = list.map((item) => (
    {
      isEdit: item.isEdit,
      value: payload && payload.thresRef,
      upper: item.upper,
      lower: item.lower,
    }
  ));
  return Object.assign(
    {},
    state,
    {
      selectedIdx: 0,
      list: newList,
    },
  );
};

const setListThreshold = (state, action) => {
  const { payload } = action;
  const { list } = state;
  if (payload && payload.length > list.length) {
    const newList = payload.map(() => (
      {
        isEdit: true,
        value: false,
        upper: false,
        lower: false,
      }
    ));
    return Object.assign({}, state, { list: newList });
  }
  return state;
};

const resetInitCommon = (state) => {
  const { list } = state;
  const newList = list.map((item) => (
    {
      isEdit: true,
      value: item.value,
      upper: item.upper,
      lower: item.lower,
    }
  ));
  return Object.assign(
    {},
    state,
    {
      selectedIdx: 0,
      list: newList,
    },
  );
};

const thresholdReducer = (state = initialState, action) => {
  switch (action.type) {
    case CURVE.SET_ALL_CURVES:
      return setListThreshold(state, action);
    case THRESHOLD.UPDATE_VALUE:
      return setThresHoldValue(state, action);
    case THRESHOLD.UPDATE_UPPER_VALUE:
      return setThresHoldUpper(state, action);
    case THRESHOLD.UPDATE_LOWER_VALUE:
      return setThresHoldLower(state, action);
    case THRESHOLD.RESET_VALUE:
      return setThresHoldValue(state, action);
    case THRESHOLD.TOGGLE_ISEDIT:
      return setThresHoldIsEdit(state);
    case MANAGER.RESET_INIT_COMMON:
      return resetInitCommon(state);
    case MANAGER.RESETALL:
      return resetAll(state, action);
    default:
      return state;
  }
};

export default thresholdReducer;
