import { MOL } from '../constants/action_type';

const initialState = {
  src: false,
  smi: false,
  mass: 0,
  svg: '',
};

const updateConversion = (state, action) => {
  const { payload } = action;
  const {
    mol, smi, mass, svg,
  } = payload;
  return Object.assign(
    {},
    state,
    {
      src: mol,
      smi,
      mass,
      svg: svg || '',
    },
  );
};

const molReducer = (state = initialState, action) => {
  switch (action.type) {
    case MOL.CONVERT_DONE:
      return updateConversion(state, action);
    case MOL.ADD_FAIL:
    case MOL.CONVERT_FAIL:
      return Object.assign({}, state, initialState);
    default:
      return state;
  }
};

export default molReducer;
