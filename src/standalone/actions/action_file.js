import { FILE } from '../constants/action_type';

const addFileInit = payload => (
  {
    type: FILE.ADD_INIT,
    payload,
  }
);

const saveFileInit = payload => (
  {
    type: FILE.SAVE_INIT,
    payload,
  }
);

const refreshFileInit = payload => (
  {
    type: FILE.REFRESH_INIT,
    payload,
  }
);

export {
  addFileInit, saveFileInit, refreshFileInit, // eslint-disable-line
};
