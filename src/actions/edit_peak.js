import { EDITPEAK } from '../constants/action_type';

const clickPoint = (payload, onPeak) => (
  {
    type: EDITPEAK.CLICK_POINT,
    payload,
    onPeak,
  }
);

const rmFromPosList = payload => (
  {
    type: EDITPEAK.RM_POSITIVE,
    payload,
  }
);

const rmFromNegList = payload => (
  {
    type: EDITPEAK.RM_NEGATIVE,
    payload,
  }
);

export {
  clickPoint,
  rmFromPosList,
  rmFromNegList,
};
