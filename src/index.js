import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import PropTypes from 'prop-types';
// import { logger } from 'redux-logger';
// import { createStore, compose, applyMiddleware } from 'redux';

import reducers from './reducers/index';
import Frame from './frame';
import { ExtractJcamp } from './helpers/chem';
import { ToXY } from './helpers/converter';
import { LIST_LAYOUT } from './constants/list_layout';

// let middlewares = [];

// if (process.env.NODE_ENV === 'development') {
//   middlewares = [...middlewares, logger];
// }

// const store = compose(
//   applyMiddleware(...middlewares),
// )(createStore)(reducers);

const store = createStore(reducers);

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
  SpectraViewer, ExtractJcamp, ToXY, LIST_LAYOUT,
};
