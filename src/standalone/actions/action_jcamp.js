import { JCAMP } from '../constants/action_type';

const addOthersInit = payload => (
  {
    type: JCAMP.ADD_OTHERS_INIT,
    payload,
  }
);

export {
  addOthersInit,  // eslint-disable-line
};
