import { MANAGER } from '../constants/action_type';

const initialState = {
  isEdit: true,
};

const managerReducer = (state = initialState, action) => {
  switch (action.type) {
    case MANAGER.TOGGLEISEDIT:
      return Object.assign({}, state, { isEdit: !state.isEdit });
    default:
      return state;
  }
};

export default managerReducer;
