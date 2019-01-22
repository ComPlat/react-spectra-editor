import React from 'react';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import PropTypes from 'prop-types';

import 'regenerator-runtime/runtime'; // eslint-disable-line
import createSagaMiddleware from 'redux-saga';
// import { logger } from 'redux-logger';

import reducers from './reducers/index';
import sagas from './sagas/index';
import Frame from './frame';
import FN from './fn';

// - - - store & middleware - - -
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware]; // logger

const store = compose(
  applyMiddleware(...middlewares),
)(createStore)(reducers);

sagaMiddleware.run(sagas);

// - - - React - - -
const SpectraViewer = ({
  input, cLabel, xLabel, yLabel, peakObjs, writePeaks, savePeaks,
}) => (
  <Provider store={store}>
    <Frame
      input={input}
      cLabel={cLabel}
      xLabel={xLabel}
      yLabel={yLabel}
      peakObjs={peakObjs}
      writePeaks={writePeaks}
      savePeaks={savePeaks}
    />
  </Provider>
);

SpectraViewer.propTypes = {
  input: PropTypes.object.isRequired,
  cLabel: PropTypes.string,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  peakObjs: PropTypes.array.isRequired,
  writePeaks: PropTypes.oneOfType(
    [
      PropTypes.func,
      PropTypes.bool,
    ],
  ),
  savePeaks: PropTypes.oneOfType(
    [
      PropTypes.func,
      PropTypes.bool,
    ],
  ),
};


SpectraViewer.defaultProps = {
  cLabel: '',
  writePeaks: false,
  savePeaks: false,
};

export {
  SpectraViewer, FN,
};
