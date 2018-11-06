import { STATUS } from '../constants/action_type';

const toggleSaveBtn = () => (
  {
    type: STATUS.TOGGLEBTNSAVE,
    payload: [],
  }
);

const toggleWriteBtn = () => (
  {
    type: STATUS.TOGGLEBTNWRITE,
    payload: [],
  }
);

const toggleAllBtn = () => (
  {
    type: STATUS.TOGGLEBTNALL,
    payload: [],
  }
);

export { toggleSaveBtn, toggleWriteBtn, toggleAllBtn };
