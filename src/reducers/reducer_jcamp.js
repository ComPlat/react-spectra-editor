/* eslint-disable prefer-object-spread, default-param-last */
import { JCAMP, MANAGER } from '../constants/action_type';

const initialState = {
  selectedIdx: 0,
  jcamps: [
    {
      others: [],
      addOthersCb: false,
    },
  ],
};

const addOthers = (state, { others, addOthersCb }) => {
  const { selectedIdx, jcamps } = state;
  const selectedJcamp = jcamps[selectedIdx];

  if (selectedJcamp.others.length > 5) return state;
  const decoOthers = others.map((o) => Object.assign({}, o, { show: true }));

  const newJcamp = Object.assign(
    {},
    selectedJcamp,
    { others: [...decoOthers].slice(0, 5), addOthersCb },
  );
  jcamps[selectedIdx] = newJcamp;

  return Object.assign({}, state, { jcamps });
};

const rmOthersOne = (state, payload) => {
  const { selectedIdx, jcamps } = state;
  const selectedJcamp = jcamps[selectedIdx];

  const idx = payload;
  const { others } = selectedJcamp;
  const nextOther = others.filter((_, i) => i !== idx);

  const newJcamp = Object.assign({}, selectedJcamp, { others: nextOther });
  jcamps[selectedIdx] = newJcamp;
  return Object.assign({}, state, { jcamps });
};

const toggleShow = (state, payload) => {
  const { selectedIdx, jcamps } = state;
  const selectedJcamp = jcamps[selectedIdx];

  const idx = payload;
  const { others } = selectedJcamp;
  const nextOthers = others.map((o, i) => {
    if (i !== idx) return o;
    const currentShow = o.show;
    return Object.assign({}, o, { show: !currentShow });
  });

  const newJcamp = Object.assign({}, selectedJcamp, { others: nextOthers });
  jcamps[selectedIdx] = newJcamp;
  return Object.assign({}, state, { jcamps });
};

const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case JCAMP.ADD_OTHERS:
      return addOthers(state, action.payload);
    case JCAMP.RM_OTHERS_ONE:
      return rmOthersOne(state, action.payload);
    case JCAMP.TOGGLE_SHOW:
      return toggleShow(state, action.payload);
    case JCAMP.CLEAR_ALL:
      return initialState;
    case MANAGER.RESETALL:
      return initialState;
    default:
      return state;
  }
};

export default layoutReducer;
