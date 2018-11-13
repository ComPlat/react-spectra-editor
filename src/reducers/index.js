import { combineReducers } from 'redux';
import borderReducer from './reducer_border';
import thresholdReducer from './reducer_threshold';
import editPeakReducer from './reducer_edit_peak';
import statusReducer from './reducer_status';
import managerReducer from './reducer_manager';
import layoutReducer from './reducer_layout';

const rootReducer = combineReducers({
  border: borderReducer,
  threshold: thresholdReducer,
  editPeak: editPeakReducer,
  status: statusReducer,
  manager: managerReducer,
  layout: layoutReducer,
});

export default rootReducer;
