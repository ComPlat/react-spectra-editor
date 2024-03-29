import { combineReducers } from 'redux';
import thresholdReducer from './reducer_threshold';
import undoableEditPeakReducer from './reducer_edit_peak';
import statusReducer from './reducer_status';
import managerReducer from './reducer_manager';
import layoutReducer from './reducer_layout';
import shiftReducer from './reducer_shift';
import scanReducer from './reducer_scan';
import forecastReducer from './reducer_forecast';
import uiReducer from './reducer_ui';
import submitReducer from './reducer_submit';
import integrationReducer from './reducer_integration';
import multiplicityReducer from './reducer_multiplicity';
import simulationReducer from './reducer_simulation';
import metaReducer from './reducer_meta';
import jcampReducer from './reducer_jcamp';
import wavelengthReducer from './reducer_wavelength';
import cyclicVoltaReducer from './reducer_voltammetry';
import curveReducer from './reducer_curve';
import axesReducer from './reducer_axes';
import detectorReducer from './reducer_detector';

const rootReducer = combineReducers({
  threshold: thresholdReducer,
  editPeak: undoableEditPeakReducer,
  status: statusReducer,
  manager: managerReducer,
  layout: layoutReducer,
  shift: shiftReducer,
  scan: scanReducer,
  forecast: forecastReducer,
  ui: uiReducer,
  submit: submitReducer,
  integration: integrationReducer,
  multiplicity: multiplicityReducer,
  simulation: simulationReducer,
  meta: metaReducer,
  jcamp: jcampReducer,
  wavelength: wavelengthReducer,
  cyclicvolta: cyclicVoltaReducer,
  curve: curveReducer,
  axesUnits: axesReducer,
  detector: detectorReducer,
});

export default rootReducer;
