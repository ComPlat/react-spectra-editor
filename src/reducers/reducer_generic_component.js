import { GENERIC_COMPONENT } from "../constants/action_type";

const initialState = {'concentration':'0'};

const genericComponentReducer = (state = initialState, action) => {
  switch(action.type) {
    case GENERIC_COMPONENT.UPDATE_GENERIC_VALUES:
      return action.payload;
    default:
      return state;
  }
};

export default genericComponentReducer;