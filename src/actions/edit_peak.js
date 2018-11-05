import { EDITPEAK } from '../constants/action_type';

const addToPosList = payload => (
  {
    type: EDITPEAK.ADDPOSITIVE,
    payload,
  }
);

const rmFromPosList = payload => (
  {
    type: EDITPEAK.RMPOSITIVE,
    payload,
  }
);

const addToNegList = payload => (
  {
    type: EDITPEAK.ADDNEGATIVE,
    payload,
  }
);

const rmFromNegList = payload => (
  {
    type: EDITPEAK.RMNEGATIVE,
    payload,
  }
);

export {
  addToPosList,
  rmFromPosList,
  addToNegList,
  rmFromNegList,
};
