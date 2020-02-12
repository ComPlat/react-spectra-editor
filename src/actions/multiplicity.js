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

const clearMpyAll = payload => (
  {
    type: MULTIPLICITY.CLEAR_ALL,
    payload,
  }
);

const resetMpyOne = payload => (
  {
    type: MULTIPLICITY.RESET_ONE,
    payload,
  }
);

export {
  clickMpyOne,
  rmMpyPeakByPanel,
  selectMpyType,
  clearMpyAll,
  resetMpyOne,
}; // eslint-disable-line
