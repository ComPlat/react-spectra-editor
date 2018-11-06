import { combineReducers } from 'redux';
import borderReducer from './reducer_border';
import thresholdReducer from './reducer_threshold';
import editPeakReducer from './reducer_edit_peak';
import statusReducer from './reducer_status';

const rootReducer = combineReducers({
  border: borderReducer,
  threshold: thresholdReducer,
  editPeak: editPeakReducer,
  status: statusReducer,
});

export default rootReducer;
