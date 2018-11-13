import { LAYOUT } from '../constants/action_type';

const updateLayout = payload => (
  {
    type: LAYOUT.UPDATE,
    payload,
  }
);

export { updateLayout }; // eslint-disable-line
