import { GENERIC_COMPONENT } from "../constants/action_type";

const updateGenericComponentValue = payload => (
  {
    type: GENERIC_COMPONENT.UPDATE_GENERIC_VALUES,
    payload: payload,
  }
);

export { updateGenericComponentValue }; // eslint-disable-line