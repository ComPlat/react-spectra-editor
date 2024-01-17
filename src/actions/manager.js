import { MANAGER } from '../constants/action_type';

const resetAll = (payload) => (
  {
    type: MANAGER.RESETALL,
    payload,
  }
);

const resetInitCommon = (payload) => (
  {
    type: MANAGER.RESET_INIT_COMMON,
    payload,
  }
);

const resetInitNmr = (payload) => (
  {
    type: MANAGER.RESET_INIT_NMR,
    payload,
  }
);

const resetInitMs = (payload) => (
  {
    type: MANAGER.RESET_INIT_MS,
    payload,
  }
);

const resetInitCommonWithIntergation = (payload) => (
  {
    type: MANAGER.RESET_INIT_COMMON_WITH_INTERGATION,
    payload,
  }
);

const resetDetector = () => ({
  type: MANAGER.RESET_DETECTOR,
});

export {
  resetAll,
  resetInitCommon,
  resetInitNmr,
  resetInitMs,
  resetInitCommonWithIntergation,
  resetDetector,
}; // eslint-disable-line
