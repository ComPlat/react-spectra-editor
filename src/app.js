/* eslint-disable react/function-component-definition, react/require-default-props */
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import PropTypes from 'prop-types';
import { StyledEngineProvider } from '@mui/material';

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
  entity, others, cLabel, xLabel, yLabel,
  operations, forecast, molSvg, editorOnly, descriptions, theoryMass,
  canChangeDescription, onDescriptionChanged,
  multiEntities, multiMolSvgs, entityFileNames, userManualLink, isComparison,
}) => (
  <Provider store={store}>
    <StyledEngineProvider injectFirst>
      <LayerInit
        entity={entity}
        multiEntities={multiEntities}
        entityFileNames={entityFileNames}
        userManualLink={userManualLink}
        others={others}
        cLabel={cLabel}
        xLabel={xLabel}
        yLabel={yLabel}
        forecast={forecast}
        operations={operations}
        descriptions={ensureQuillDelta(descriptions)}
        molSvg={molSvg}
        multiMolSvgs={multiMolSvgs}
        editorOnly={editorOnly}
        theoryMass={theoryMass}
        canChangeDescription={canChangeDescription}
        onDescriptionChanged={onDescriptionChanged}
        isComparison={isComparison}
      />
    </StyledEngineProvider>
  </Provider>
);

SpectraEditor.propTypes = {
  entity: PropTypes.object.isRequired,
  multiEntities: PropTypes.array,
  entityFileNames: PropTypes.array,
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
  multiMolSvgs: PropTypes.array,
  editorOnly: PropTypes.bool,
  canChangeDescription: PropTypes.bool,
  onDescriptionChanged: PropTypes.func,
  userManualLink: PropTypes.object,
  theoryMass: PropTypes.string,
  isComparison: PropTypes.bool,
};

SpectraEditor.defaultProps = {
  others: { others: [], addOthersCb: false },
  multiEntities: false,
  entityFileNames: false,
  cLabel: '',
  xLabel: '',
  yLabel: '',
  forecast: {},
  operations: [],
  descriptions: [],
  molSvg: '',
  theoryMass: '',
  multiMolSvgs: [],
  editorOnly: false,
  canChangeDescription: false,
  userManualLink: {},
  isComparison: true,
};

export {
  SpectraEditor, FN,
};
