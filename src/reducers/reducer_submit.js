import { SUBMIT } from '../constants/action_type';

const initialState = {
  isAscend: true,
  operation: { name: 'empty' },
};

const submitReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT.TOGGLE_IS_ASCEND:
      return Object.assign({}, state, { isAscend: !state.isAscend });
    case SUBMIT.UPDATE_OPERATION:
      return Object.assign({}, state, { operation: action.payload });
    default:
      return state;
  }
};

export default submitReducer;
