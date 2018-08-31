import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import PropTypes from 'prop-types';

import reducers from './reducers/index';
import App from './components/app';

const store = createStore(reducers);

const SpectraViewer = ({
  input, cLabel, xLabel, yLabel,
}) => (
  <Provider store={store}>
    <App
      seed={input}
      cLabel={cLabel}
      xLabel={xLabel}
      yLabel={yLabel}
    />
  </Provider>
);

SpectraViewer.propTypes = {
  input: PropTypes.array.isRequired,
  cLabel: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
};

export default SpectraViewer;
