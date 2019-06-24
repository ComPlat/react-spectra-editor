import { FORECAST } from '../constants/action_type';

const initForecastStatus = payload => (
  {
    type: FORECAST.INIT_STATUS,
    payload,
  }
);

const setIrStatus = payload => (
  {
    type: FORECAST.SET_IR_STATUS,
    payload,
  }
);

const setNmrStatus = payload => (
  {
    type: FORECAST.SET_NMR_STATUS,
    payload,
  }
);

const clearForecastStatus = payload => (
  {
    type: FORECAST.CLEAR_STATUS,
    payload,
  }
);

export {
  initForecastStatus, setIrStatus, setNmrStatus, clearForecastStatus,
};
