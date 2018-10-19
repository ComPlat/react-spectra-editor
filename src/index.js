import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import PropTypes from 'prop-types';

import reducers from './reducers/index';
import Frame from './frame';
import { ExtractJcamp } from './helpers/chem';

const store = createStore(reducers);

const SpectraViewer = ({
  input, cLabel, xLabel, yLabel, peakObj,
}) => (
  <Provider store={store}>
    <Frame
      input={input}
      cLabel={cLabel}
      xLabel={xLabel}
      yLabel={yLabel}
      peakObj={peakObj}
    />
  </Provider>
);

SpectraViewer.propTypes = {
  input: PropTypes.object.isRequired,
  cLabel: PropTypes.string,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  peakObj: PropTypes.object.isRequired,
};

SpectraViewer.defaultProps = {
  cLabel: '',
};

export { SpectraViewer, ExtractJcamp };
