import { MANAGER } from '../constants/action_type';

const resetAll = payload => (
  {
    type: MANAGER.RESETALL,
    payload,
  }
);

const toggleIsEdit = payload => (
  {
    type: MANAGER.TOGGLEISEDIT,
    payload,
  }
);

export { resetAll, toggleIsEdit }; // eslint-disable-line
