import { STATUS } from '../constants/action_type';

const toggleSubmitBtn = () => (
  {
    type: STATUS.TOGGLEBTNSUBMIT,
    payload: [],
  }
);

const toggleAllBtn = () => (
  {
    type: STATUS.TOGGLEBTNALL,
    payload: [],
  }
);

const enableAllBtn = () => (
  {
    type: STATUS.ENABLEBTNALL,
    payload: [],
  }
);

export {
  toggleSubmitBtn, toggleAllBtn, enableAllBtn,
};
