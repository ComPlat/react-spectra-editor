import { combineReducers } from 'redux';
import borderReducer from './reducer_border';
import thresholdReducer from './reducer_threshold';

const rootReducer = combineReducers({
  border: borderReducer,
  threshold: thresholdReducer,
});

export default rootReducer;
