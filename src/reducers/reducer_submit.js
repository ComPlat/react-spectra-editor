import { SUBMIT, LAYOUT, MANAGER } from '../constants/action_type';
import Format from '../helpers/format';

const initialState = {
  isAscend: false,
  isIntensity: true,
  decimal: 2,
  operation: { name: 'empty' },
};

const updateOperation = action => (
  { operation: action.payload || initialState.operation }
);

const submitReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT.TOGGLE_IS_ASCEND:
      return Object.assign({}, state, { isAscend: !state.isAscend });
    case SUBMIT.TOGGLE_IS_INTENSITY:
      return Object.assign({}, state, { isIntensity: !state.isIntensity });
    case SUBMIT.UPDATE_OPERATION:
      return Object.assign({}, state, updateOperation(action));
    case SUBMIT.UPDATE_DECIMAL:
      return Object.assign({}, state, { decimal: action.payload.target.value });
    case LAYOUT.UPDATE: {
      const decimal = Format.spectraDigit(action.payload);
      return Object.assign({}, state, { decimal });
    }
    case MANAGER.RESETALL: {
      const decimal = Format.spectraDigit(action.payload.operation.layout);
      return Object.assign({}, state, { decimal });
    }
    default:
      return state;
  }
};

export default submitReducer;
