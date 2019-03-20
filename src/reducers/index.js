import { combineReducers } from 'redux';
import borderReducer from './reducer_border';
import thresholdReducer from './reducer_threshold';
import editPeakReducer from './reducer_edit_peak';
import statusReducer from './reducer_status';
import managerReducer from './reducer_manager';
import layoutReducer from './reducer_layout';
import shiftReducer from './reducer_shift';
import modeReducer from './reducer_mode';
import scanReducer from './reducer_scan';

const rootReducer = combineReducers({
  border: borderReducer,
  threshold: thresholdReducer,
  editPeak: editPeakReducer,
  status: statusReducer,
  manager: managerReducer,
  layout: layoutReducer,
  shift: shiftReducer,
  mode: modeReducer,
  scan: scanReducer,
});

export default rootReducer;
