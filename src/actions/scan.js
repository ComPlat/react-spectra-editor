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

export {
  setScanTarget, resetScanTarget, // eslint-disable-line
};
