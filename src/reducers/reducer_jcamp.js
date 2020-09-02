import { JCAMP } from '../constants/action_type';

const initialState = {
  others: [],
  addOthersCb: false,
};

const addOthers = ({ others, cb }) => ({ others, addOthersCb: cb });

const layoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case JCAMP.ADD_OTHERS:
      return addOthers(action.payload);
    case JCAMP.CLEAR_ALL:
      return initialState;
    default:
      return state;
  }
};

export default layoutReducer;
