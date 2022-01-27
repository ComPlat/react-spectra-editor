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

// - - - helper - - -
const ensureQuillDelta = (descs) => {
  const isArr = Array.isArray(descs);
  return isArr ? descs : [{ insert: descs }];
};

// - - - React - - -
const SpectraEditor = ({
  entity, others, cLabel, xLabel, yLabel, xUnit, yUnit,
  operations, forecast, molSvg, editorOnly, descriptions,
  canChangeDescription, onDescriptionChanged
}) => (
  <Provider store={store}>
    <LayerInit
      entity={entity}
      others={others}
      cLabel={cLabel}
      xLabel={xLabel}
      yLabel={yLabel}
      xUnit={xUnit}
      yUnit={yUnit}
      forecast={forecast}
      operations={operations}
      descriptions={ensureQuillDelta(descriptions)}
      molSvg={molSvg}
      editorOnly={editorOnly}
      canChangeDescription={canChangeDescription}
      onDescriptionChanged={onDescriptionChanged}
    />
  </Provider>
);

SpectraEditor.propTypes = {
  entity: PropTypes.object.isRequired,
  others: PropTypes.object,
  cLabel: PropTypes.string,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  forecast: PropTypes.object,
  operations: PropTypes.array,
  descriptions: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  molSvg: PropTypes.string,
  editorOnly: PropTypes.bool,
  canChangeDescription: PropTypes.bool,
  onDescriptionChanged: PropTypes.func
};

SpectraEditor.defaultProps = {
  others: { others: [], addOthersCb: false },
  cLabel: '',
  xLabel: '',
  yLabel: '',
  xUnit: '',
  yUnit: '',
  forecast: {},
  operations: [],
  descriptions: [],
  molSvg: '',
  editorOnly: false,
  canChangeDescription: false,
};

export {
  SpectraEditor, FN,
};
