import { LAYOUT } from '../constants/action_type';

const updateLayout = (payload) => (
  {
    type: LAYOUT.UPDATE,
    payload,
  }
);

// See reducer_layout_override.js. Kept in step with the entity execReset is
// currently normalizing, so a manual pick dispatched alongside updateLayoutAct
// (the layout dropdown's onChange) can be recorded against the right dataset.
const setCurrentDataset = (payload) => (
  {
    type: LAYOUT.SET_CURRENT_DATASET,
    payload,
  }
);

// payload: { datasetId, layout } -- what the user picked, and for which dataset.
const setManualLayoutOverride = (payload) => (
  {
    type: LAYOUT.SET_MANUAL_OVERRIDE,
    payload,
  }
);

export { updateLayout, setCurrentDataset, setManualLayoutOverride }; // eslint-disable-line
