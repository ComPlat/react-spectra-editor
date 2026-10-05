import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import createClientStore from './store';
import Frame from './frame';


// One store per page, created on first render rather than on import.
let store = null;
const getStore = () => {
  if (!store) store = createClientStore();
  return store;
};


// - - - React - - -
const ChemSpectraClient = ({ editorOnly }) => (
  <Provider store={getStore()}>
    <Frame editorOnly={editorOnly} />
  </Provider>
);

ChemSpectraClient.propTypes = {
  editorOnly: PropTypes.bool,
};

ChemSpectraClient.defaultProps = {
  editorOnly: false,
};

export { ChemSpectraClient }; // eslint-disable-line
