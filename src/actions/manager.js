import { MANAGER } from '../constants/action_type';

const resetAll = payload => (
  {
    type: MANAGER.RESETALL,
    payload,
  }
);

export { resetAll }; // eslint-disable-line
