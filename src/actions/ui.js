import { UI } from '../constants/action_type';
import { LIST_UI_SWEEP_TYPE } from '../constants/list_ui';
import { confirmCancelPendingIntegration } from '../helpers/integration_draft.js'; // eslint-disable-line import/extensions

const keepIntegrationMode = (jcampIdx = 0) => ({
  type: UI.SWEEP.SET_TYPE,
  payload: LIST_UI_SWEEP_TYPE.INTEGRATION_ADD,
  jcampIdx,
});

const setUiViewerType = (payload) => {
  if (!confirmCancelPendingIntegration()) {
    return keepIntegrationMode();
  }

  return {
    type: UI.VIEWER.SET_TYPE,
    payload,
  };
};

const setUiSweepType = (payload, jcampIdx = 0) => {
  if (
    payload !== LIST_UI_SWEEP_TYPE.INTEGRATION_ADD
    && !confirmCancelPendingIntegration()
  ) {
    return keepIntegrationMode(jcampIdx);
  }

  return {
    type: UI.SWEEP.SET_TYPE,
    payload,
    jcampIdx,
  };
};

const selectUiSweep = (payload) => (
  {
    type: UI.SWEEP.SELECT,
    payload,
  }
);

const scrollUiWheel = (payload) => (
  {
    type: UI.WHEEL.SCROLL,
    payload,
  }
);

const clickUiTarget = (
  payload,
  onPeak,
  voltammetryPeakIdx = 0,
  jcampIdx = 0,
  onPecker = false,
  sourceHint = null,
) => ({
  type: UI.CLICK_TARGET,
  payload,
  onPeak,
  voltammetryPeakIdx,
  jcampIdx,
  onPecker,
  sourceHint,
});

const displaySubViewerAt = (payload) => ({
  type: UI.SUB_VIEWER.DISPLAY_VIEWER_AT,
  payload: payload == null ? { x: null, y: null } : payload,
});

export {
  setUiViewerType,
  setUiSweepType,
  selectUiSweep,
  scrollUiWheel,
  clickUiTarget,
  displaySubViewerAt,
};
