import { MANAGER } from '../constants/action_type';

const resetAll = payload => (
  {
    type: MANAGER.RESETALL,
    payload,
  }
);

const resetParamsAll = payload => (
  {
    type: MANAGER.RESETPARAMSALL,
    payload,
  }
);

export {
  resetAll, resetParamsAll,
}; // eslint-disable-line
