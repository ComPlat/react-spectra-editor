import { JCAMP, MANAGER } from '../constants/action_type';

const initialState = {
  others: [],
  addOthersCb: false,
};

const addOthers = (state, { others, addOthersCb }) => {
  if (state.others.length > 5) return state;
  const decoOthers = others.map(o => Object.assign({}, o, { show: true }));

  return (
    {
      others: [...state.others, ...decoOthers].slice(0, 5),
      addOthersCb,
    }
  );
};

const rmOthersOne = (state, payload) => {
  const idx = payload;
  const { others } = state;
  const nextOther = others.filter((_, i) => i !== idx);
  return Object.assign(
    {},
    state,
    { others: nextOther },
  );
};

const toggleShow = (state, payload) => {
  const idx = payload;
  const { others } = state;
  const nextOthers = others.map((o, i) => {
    if (i !== idx) return o;
    const currentShow = o.show;
    return Object.assign({}, o, { show: !currentShow });
  });

  return Object.assign(
    {},
    state,
    { others: nextOthers },
  );
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
