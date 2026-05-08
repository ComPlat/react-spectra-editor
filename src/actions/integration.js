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

export {
  sweepIntegration,
  setIntegrationFkr,
  clearIntegrationAll,
  splitIntegration,
}; // eslint-disable-line
