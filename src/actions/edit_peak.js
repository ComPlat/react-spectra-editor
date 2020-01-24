import { EDITPEAK } from '../constants/action_type';

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
  rmFromPosList,
  rmFromNegList,
};
