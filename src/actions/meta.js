import { META } from '../constants/action_type';

const updateMetaPeaks = (payload) => (
  {
    type: META.UPDATE_PEAKS,
    payload,
  }
);

const updateDSCMetaData = (payload) => (
  {
    type: META.UPDATE_META_DATA,
    payload,
  }
);

export {
  updateMetaPeaks, updateDSCMetaData, // eslint-disable-line
};
