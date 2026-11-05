// The environment the dev server runs with. `yarn start` serves the standalone ChemSpectra client
// against the chem-spectra-app at CHEM_SPECTRA_APP_URL (src/setupProxy.js forwards the API
// calls), and needs that URL. `yarn start:dev` serves the editor dev page, for developing the
// editor and for the Cypress specs. react-scripts only passes REACT_APP_* variables to the page,
// so the choice is made here.
const CLIENT_PORT = '4000';

const startEnv = (env, { dev = false } = {}) => {
  if (dev) {
    return { env: { ...env, REACT_APP_PAGE: 'dev' }, error: null };
  }
  const backend = (env.CHEM_SPECTRA_APP_URL || '').trim();
  if (!backend) {
    return {
      env,
      error: 'set CHEM_SPECTRA_APP_URL to a chem-spectra-app, e.g. '
        + 'CHEM_SPECTRA_APP_URL=http://localhost:3007 yarn start '
        + '(for the editor dev page: yarn start:dev)',
    };
  }
  return {
    env: {
      ...env,
      CHEM_SPECTRA_APP_URL: backend,
      REACT_APP_PAGE: 'standalone',
      REACT_APP_STANDALONE_EDITOR_ONLY: env.CHEM_SPECTRA_EDITOR_ONLY === 'true' ? 'true' : 'false',
      PORT: env.PORT || CLIENT_PORT,
    },
    error: null,
  };
};

module.exports = { startEnv };
