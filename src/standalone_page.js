// The standalone ChemSpectra client as a page, served by `yarn start` against the chem-spectra-app
// at CHEM_SPECTRA_APP_URL (see scripts/start.js and src/setupProxy.js). Dev server only; never
// compiled into dist.
import React from 'react';
import ReactDOM from 'react-dom';

import { ChemSpectraClient } from './standalone/index';
import './__tests__/style/svg.css';

ReactDOM.render(
  <ChemSpectraClient editorOnly={process.env.REACT_APP_STANDALONE_EDITOR_ONLY === 'true'} />,
  document.getElementById('root'),
);
