import { MOL } from '../constants/action_type';

const addMolInit = payload => (
  {
    type: MOL.ADD_INIT,
    payload,
  }
);

export {
  addMolInit, // eslint-disable-line
};
