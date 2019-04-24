import { UI } from '../constants/action_type';

const setPanelIdx = (_, payload) => (
  {
    type: UI.VIEWER.SET_PANEL_IDX,
    payload,
  }
);

export { setPanelIdx }; // eslint-disable-line
