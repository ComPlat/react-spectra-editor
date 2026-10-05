import { FORM } from '../constants/action_type';

const submitForm = payload => (
  {
    type: FORM.SUBMIT,
    payload,
  }
);

export {
  submitForm, // eslint-disable-line
};
