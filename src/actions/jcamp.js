import { JCAMP } from '../constants/action_type';

const addOthers = payload => (
  {
    type: JCAMP.ADD_OTHERS,
    payload,
  }
);

const clearAll = payload => (
  {
    type: JCAMP.CLEAR_ALL,
    payload,
  }
);

export {
  addOthers,
  clearAll,
};
