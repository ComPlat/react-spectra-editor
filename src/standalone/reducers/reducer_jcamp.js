/* eslint-disable no-unused-vars */
import { JCAMP } from '../constants/action_type';

const initialState = {
  others: [],
};

const addOthers = ({ jcamp }) => ({ others: [jcamp] });

const jcampReducer = (state = initialState, action) => {
  switch (action.type) {
    case JCAMP.ADD_OTHERS_RDC:
      return addOthers(action.payload);
    default:
      return initialState;
  }
};

export default jcampReducer;
