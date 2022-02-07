import { THRESHOLD } from '../constants/action_type';

const updateThresholdValue = payload => (
  {
    type: THRESHOLD.UPDATE_VALUE,
    payload,
  }
);

const resetThresholdValue = () => (
  {
    type: THRESHOLD.RESET_VALUE,
    payload: false,
  }
);

const toggleThresholdIsEdit = payload => (
  {
    type: THRESHOLD.TOGGLE_ISEDIT,
    payload,
  }
);

const updateUpperThresholdValue = payload => (
  {
    type: THRESHOLD.UPDATE_UPPER_VALUE,
    payload,
  }
);

const updateLowerThresholdValue = payload => (
  {
    type: THRESHOLD.UPDATE_LOWER_VALUE,
    payload,
  }
);

export {
  updateThresholdValue, resetThresholdValue, toggleThresholdIsEdit,
  updateUpperThresholdValue, updateLowerThresholdValue,
};
