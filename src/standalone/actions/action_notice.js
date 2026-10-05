import { NOTICE } from '../constants/action_type';

const manualClear = payload => (
  {
    type: NOTICE.MANUAL_CLEAR,
    payload,
  }
);

export {
  manualClear, // eslint-disable-line
};
