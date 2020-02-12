import { META } from '../constants/action_type';

const updateMetaPeaks = payload => (
  {
    type: META.UPDATE_PEAKS,
    payload,
  }
);

export {
  updateMetaPeaks, // eslint-disable-line
};
