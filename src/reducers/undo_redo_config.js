import { includeAction } from 'redux-undo';
import {
  EDITPEAK, MANAGER, UI, INTEGRATION, MULTIPLICITY,
} from '../constants/action_type';

const undoRedoActions = [
  EDITPEAK.ADD_POSITIVE, EDITPEAK.ADD_NEGATIVE,
  EDITPEAK.RM_POSITIVE, EDITPEAK.RM_NEGATIVE,
  EDITPEAK.SHIFT,
  MANAGER.RESETALL, MANAGER.RESETSHIFT, MANAGER.RESET_INIT_COMMON, MANAGER.RESET_INIT_NMR, MANAGER.RESET_INIT_MS,
  UI.SWEEP.SELECT_INTEGRATION,
  UI.SWEEP.SELECT_MULTIPLICITY_RDC,
  INTEGRATION.RM_ONE, INTEGRATION.SET_REF, INTEGRATION.SET_FKR,
  INTEGRATION.RESET_ALL, INTEGRATION.CLEAR_ALL,
  MULTIPLICITY.PEAK_RM_BY_PANEL_RDC, MULTIPLICITY.PEAK_RM_BY_UI_RDC,
  MULTIPLICITY.PEAK_ADD_BY_UI_RDC, MULTIPLICITY.RESET_ONE_RDC,
  MULTIPLICITY.UPDATE_J, MULTIPLICITY.TYPE_SELECT_RDC,
  MULTIPLICITY.ONE_CLICK, MULTIPLICITY.ONE_CLICK_BY_UI,
  MULTIPLICITY.RESET_ALL_RDC, MULTIPLICITY.CLEAR_ALL,
];

const undoRedoConfig = {
  debug: false,
  limit: 10,
  ignoreInitialState: true,
  filter: includeAction(undoRedoActions),
  clearHistoryType: [
    EDITPEAK.SHIFT,
    MANAGER.RESETALL, MANAGER.RESETSHIFT, MANAGER.RESET_INIT_COMMON, MANAGER.RESET_INIT_NMR, MANAGER.RESET_INIT_MS,
  ],
  neverSkipReducer: [
    EDITPEAK.SHIFT,
    MANAGER.RESETALL, MANAGER.RESETSHIFT, MANAGER.RESET_INIT_COMMON, MANAGER.RESET_INIT_NMR, MANAGER.RESET_INIT_MS,
  ],
};

export { undoRedoConfig, undoRedoActions };
