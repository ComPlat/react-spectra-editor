import { INVERT_Y } from '../constants/action_type';

const toggleInvertY = () => (
  {
    type: INVERT_Y.TOGGLE,
    payload: null,
  }
);

// payload: whether the y-axis starts inverted, from the file's ##$CSINVERTY.
const seedInvertY = (payload) => (
  {
    type: INVERT_Y.SEED,
    payload,
  }
);

export { toggleInvertY, seedInvertY }; // eslint-disable-line
