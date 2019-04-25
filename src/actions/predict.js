import { PREDICT } from '../constants/action_type';

const initPredictStatus = payload => (
  {
    type: PREDICT.INIT_STATUS,
    payload,
  }
);

const setIrStatus = payload => (
  {
    type: PREDICT.SET_IR_STATUS,
    payload,
  }
);

const setNmrStatus = payload => (
  {
    type: PREDICT.SET_NMR_STATUS,
    payload,
  }
);

const clearPredictStatus = payload => (
  {
    type: PREDICT.CLEAR_STATUS,
    payload,
  }
);

export {
  initPredictStatus, setIrStatus, setNmrStatus, clearPredictStatus,
};
