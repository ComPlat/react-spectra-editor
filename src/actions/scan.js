import { SCAN } from '../constants/action_type';

const setScanTarget = payload => (
  {
    type: SCAN.SET_TARGET,
    payload,
  }
);

const resetScanTarget = () => (
  {
    type: SCAN.SET_TARGET,
    payload: false,
  }
);

const resetScanAll = payload => (
  {
    type: SCAN.RESET_ALL,
    payload,
  }
);

const toggleScanIsAuto = payload => (
  {
    type: SCAN.TOGGLE_ISAUTO,
    payload,
  }
);

export {
  setScanTarget, resetScanTarget, resetScanAll, toggleScanIsAuto,
};
