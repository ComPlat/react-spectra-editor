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

const clearIntegrationAll = payload => (
  {
    type: INTEGRATION.CLEAR_ALL,
    payload,
  }
);

export {
  sweepIntegration,
  setIntegrationFkr,
  clearIntegrationAll
}; // eslint-disable-line
