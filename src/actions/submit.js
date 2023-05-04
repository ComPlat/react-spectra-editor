import { SUBMIT } from '../constants/action_type';

const toggleIsAscend = () => (
  {
    type: SUBMIT.TOGGLE_IS_ASCEND,
    payload: false,
  }
);

const toggleIsIntensity = () => (
  {
    type: SUBMIT.TOGGLE_IS_INTENSITY,
    payload: false,
  }
);

const updateOperation = (payload) => (
  {
    type: SUBMIT.UPDATE_OPERATION,
    payload,
  }
);

const updateDecimal = (payload) => (
  {
    type: SUBMIT.UPDATE_DECIMAL,
    payload,
  }
);

export {
  toggleIsAscend, toggleIsIntensity,
  updateOperation, updateDecimal,
};
