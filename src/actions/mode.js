import { MODE } from '../constants/action_type';

const setEditMode = payload => (
  {
    type: MODE.SET_EDIT,
    payload,
  }
);

export { setEditMode }; // eslint-disable-line
