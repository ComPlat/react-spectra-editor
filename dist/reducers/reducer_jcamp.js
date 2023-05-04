"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _action_type = require("../constants/action_type");
/* eslint-disable prefer-object-spread, default-param-last */

const initialState = {
  selectedIdx: 0,
  jcamps: [{
    others: [],
    addOthersCb: false
  }]
};
const addOthers = (state, _ref) => {
  let {
    others,
    addOthersCb
  } = _ref;
  const {
    selectedIdx,
    jcamps
  } = state;
  const selectedJcamp = jcamps[selectedIdx];
  if (selectedJcamp.others.length > 5) return state;
  const decoOthers = others.map(o => Object.assign({}, o, {
    show: true
  }));
  const newJcamp = Object.assign({}, selectedJcamp, {
    others: [...selectedJcamp.others, ...decoOthers].slice(0, 5),
    addOthersCb
  });
  jcamps[selectedIdx] = newJcamp;
  return Object.assign({}, state, {
    jcamps
  });
};
const rmOthersOne = (state, payload) => {
  const {
    selectedIdx,
    jcamps
  } = state;
  const selectedJcamp = jcamps[selectedIdx];
  const idx = payload;
  const {
    others
  } = selectedJcamp;
  const nextOther = others.filter((_, i) => i !== idx);
  const newJcamp = Object.assign({}, selectedJcamp, {
    others: nextOther
  });
  jcamps[selectedIdx] = newJcamp;
  return Object.assign({}, state, {
    jcamps
  });
};
const toggleShow = (state, payload) => {
  const {
    selectedIdx,
    jcamps
  } = state;
  const selectedJcamp = jcamps[selectedIdx];
  const idx = payload;
  const {
    others
  } = selectedJcamp;
  const nextOthers = others.map((o, i) => {
    if (i !== idx) return o;
    const currentShow = o.show;
    return Object.assign({}, o, {
      show: !currentShow
    });
  });
  const newJcamp = Object.assign({}, selectedJcamp, {
    others: nextOthers
  });
  jcamps[selectedIdx] = newJcamp;
  return Object.assign({}, state, {
    jcamps
  });
};
const layoutReducer = function () {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  switch (action.type) {
    case _action_type.JCAMP.ADD_OTHERS:
      return addOthers(state, action.payload);
    case _action_type.JCAMP.RM_OTHERS_ONE:
      return rmOthersOne(state, action.payload);
    case _action_type.JCAMP.TOGGLE_SHOW:
      return toggleShow(state, action.payload);
    case _action_type.JCAMP.CLEAR_ALL:
      return initialState;
    case _action_type.MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};
var _default = layoutReducer;
exports.default = _default;