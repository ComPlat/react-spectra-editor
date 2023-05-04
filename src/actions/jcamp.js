import { JCAMP } from '../constants/action_type';

const addOthers = (payload) => (
  {
    type: JCAMP.ADD_OTHERS,
    payload,
  }
);

const rmOthersOne = (payload) => (
  {
    type: JCAMP.RM_OTHERS_ONE,
    payload,
  }
);

const toggleShow = (payload) => (
  {
    type: JCAMP.TOGGLE_SHOW,
    payload,
  }
);

const clearAll = (payload) => (
  {
    type: JCAMP.CLEAR_ALL,
    payload,
  }
);

export {
  addOthers,
  rmOthersOne,
  toggleShow,
  clearAll,
};
