import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import PropTypes from 'prop-types';

import reducers from './reducers/index';
import App from './components/app';

const store = createStore(reducers);

const SpectraViewer = ({
  input, cLabel, xLabel, yLabel, width, height,
}) => (
  <Provider store={store}>
    <App
      seed={input}
      cLabel={cLabel}
      xLabel={xLabel}
      yLabel={yLabel}
      width={width}
      height={height}
    />
  </Provider>
);

SpectraViewer.propTypes = {
  input: PropTypes.array.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default SpectraViewer;
