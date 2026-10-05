import { DESC } from '../constants/action_type';

const updateDesc = payload => (
  {
    type: DESC.UPDATE,
    payload,
  }
);

export {
  updateDesc, // eslint-disable-line
};
