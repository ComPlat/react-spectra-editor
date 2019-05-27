import { SUBMIT } from '../constants/action_type';

const toggleIsAscend = () => (
  {
    type: SUBMIT.TOGGLE_IS_ASCEND,
    payload: false,
  }
);

const updateOperation = payload => (
  {
    type: SUBMIT.UPDATE_OPERATION,
    payload,
  }
);

const updateDecimal = payload => (
  {
    type: SUBMIT.UPDATE_DECIMAL,
    payload,
  }
);

export {
  toggleIsAscend, updateOperation, updateDecimal,
};
