import { combineReducers } from 'redux';
import borderReducer from './reducer_border';

const rootReducer = combineReducers({
  border: borderReducer,
});

export default rootReducer;
