import { combineReducers } from 'redux';
import borderReducer from './reducer_border';
import thresholdReducer from './reducer_threshold';
import editPeakReducer from './reducer_edit_peak';

const rootReducer = combineReducers({
  border: borderReducer,
  threshold: thresholdReducer,
  editPeak: editPeakReducer,
});

export default rootReducer;
