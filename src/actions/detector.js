/* eslint-disable import/prefer-default-export */
import { SEC } from '../constants/action_type';

const updateDetector = (payload) => (
  {
    type: SEC.UPDATE_DETECTOR,
    payload,
  }
);

export { updateDetector };
