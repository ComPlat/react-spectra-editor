import { BORDER } from '../constants/action_type';

const updateBorder = payload => (
  {
    type: BORDER.UPDATE,
    payload,
  }
);

const resetBorder = () => (
  {
    type: BORDER.UPDATE,
    payload: [],
  }
);

export { updateBorder, resetBorder }; // eslint-disable-line
