import { PREDICT } from '../constants/action_type';

const initPredictStatus = payload => (
  {
    type: PREDICT.INIT_STATUS,
    payload,
  }
);

const selectIrStatus = payload => (
  {
    type: PREDICT.SELECT_IR_STATUS,
    payload,
  }
);

export {
  initPredictStatus, selectIrStatus, // eslint-disable-line
};
