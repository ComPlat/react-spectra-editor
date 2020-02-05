import { INTEGRATION } from '../constants/action_type';

const sweepIntegration = payload => (
  {
    type: INTEGRATION.SWEEP,
    payload,
  }
);

const setIntegrationFkr = payload => (
  {
    type: INTEGRATION.SET_FKR,
    payload,
  }
);

const resetIntegrationAll = payload => (
  {
    type: INTEGRATION.RESET_ALL,
    payload,
  }
);

const clearIntegrationAll = payload => (
  {
    type: INTEGRATION.CLEAR_ALL,
    payload,
  }
);

export {
  sweepIntegration,
  setIntegrationFkr,
  resetIntegrationAll,
  clearIntegrationAll,
}; // eslint-disable-line
