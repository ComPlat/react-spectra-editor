import { UI } from '../constants/action_type';

const setUiViewerType = payload => (
  {
    type: UI.VIEWER.SET_TYPE,
    payload,
  }
);

const setUiSweepType = payload => (
  {
    type: UI.SWEEP.SET_TYPE,
    payload,
  }
);

const selectUiSweep = payload => (
  {
    type: UI.SWEEP.SELECT,
    payload,
  }
);

const scrollUiWheel = payload => (
  {
    type: UI.WHEEL.SCROLL,
    payload,
  }
);

const clickUiTarget = (payload, onPeak) => (
  {
    type: UI.CLICK_TARGET,
    payload,
    onPeak,
  }
);

export {
  setUiViewerType,
  setUiSweepType,
  selectUiSweep,
  scrollUiWheel,
  clickUiTarget,
};
