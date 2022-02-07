import { UI } from '../constants/action_type';

const setUiViewerType = payload => (
  {
    type: UI.VIEWER.SET_TYPE,
    payload,
  }
);

const setUiSweepType = (payload, jcampIdx = 0) => (
  {
    type: UI.SWEEP.SET_TYPE,
    payload,
    jcampIdx,
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

const clickUiTarget = (payload, onPeak, voltammetryPeakIdx = 0, jcampIdx = 0, onPecker = false) => (
  {
    type: UI.CLICK_TARGET,
    payload,
    onPeak,
    voltammetryPeakIdx,
    jcampIdx,
    onPecker,
  }
);

export {
  setUiViewerType,
  setUiSweepType,
  selectUiSweep,
  scrollUiWheel,
  clickUiTarget,
};
