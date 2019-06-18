import React from 'react';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import PropTypes from 'prop-types';

import 'regenerator-runtime/runtime'; // eslint-disable-line
import createSagaMiddleware from 'redux-saga';
// import { logger } from 'redux-logger';

import reducers from './reducers/index';
import sagas from './sagas/index';
import LayerInit from './layer_init';
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
  entity, cLabel, xLabel, yLabel, operations, forecast,
}) => (
  <Provider store={store}>
    <LayerInit
      entity={entity}
      cLabel={cLabel}
      xLabel={xLabel}
      yLabel={yLabel}
      forecast={forecast}
      operations={operations}
    />
  </Provider>
);

SpectraViewer.propTypes = {
  entity: PropTypes.object.isRequired,
  cLabel: PropTypes.string,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  forecast: PropTypes.object,
  operations: PropTypes.array,
};

SpectraViewer.defaultProps = {
  cLabel: '',
  xLabel: '',
  yLabel: '',
  forecast: {},
  operations: [],
};

export {
  SpectraViewer, FN,
};
