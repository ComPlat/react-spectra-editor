import { MANAGER } from '../constants/action_type';

const resetInitCommon = payload => (
  {
    type: MANAGER.RESETINITCOMMON,
    payload,
  }
);

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
  resetInitCommon, resetAll, resetParamsAll,
}; // eslint-disable-line
