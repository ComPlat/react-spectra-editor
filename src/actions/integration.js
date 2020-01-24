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

export { sweepIntegration, setIntegrationFkr }; // eslint-disable-line
