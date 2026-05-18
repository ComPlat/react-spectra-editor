import { INTEGRATION } from '../constants/action_type';

const sweepIntegration = (payload) => (
  {
    type: INTEGRATION.SWEEP,
    payload,
  }
);

const setIntegrationFkr = (payload) => (
  {
    type: INTEGRATION.SET_FKR,
    payload,
  }
);

const clearIntegrationAll = (payload) => (
  {
    type: INTEGRATION.CLEAR_ALL,
    payload,
  }
);

const splitIntegration = (payload) => (
  {
    type: INTEGRATION.SPLIT,
    payload,
  }
);

const addVisualSplitLine = (payload) => (
  {
    type: INTEGRATION.ADD_VISUAL_SPLIT,
    payload,
  }
);

const removeVisualSplitLine = (payload) => (
  {
    type: INTEGRATION.RM_VISUAL_SPLIT,
    payload,
  }
);

export {
  addVisualSplitLine,
  sweepIntegration,
  setIntegrationFkr,
  clearIntegrationAll,
  removeVisualSplitLine,
  splitIntegration,
}; // eslint-disable-line
