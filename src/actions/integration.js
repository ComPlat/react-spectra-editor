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

export {
  sweepIntegration, setIntegrationFkr, resetIntegrationAll,
}; // eslint-disable-line
