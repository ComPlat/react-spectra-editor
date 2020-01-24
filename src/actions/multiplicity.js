import { MULTIPLICITY } from '../constants/action_type';

const clickMpyOne = payload => (
  {
    type: MULTIPLICITY.ONE_CLICK,
    payload,
  }
);

const rmMpyPeakByPanel = payload => (
  {
    type: MULTIPLICITY.PEAK_RM_BY_PANEL,
    payload,
  }
);

const selectMpyType = payload => (
  {
    type: MULTIPLICITY.TYPE_SELECT,
    payload,
  }
);

export {
  clickMpyOne, rmMpyPeakByPanel, selectMpyType,
}; // eslint-disable-line
