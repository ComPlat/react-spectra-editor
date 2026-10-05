// Dev server only (react-scripts start; never compiled into dist). Proxies the
// ChemSpectra backend so the standalone client can be tried locally:
//   CHEM_SPECTRA_APP_URL=https://your-backend yarn start:standalone
// CHEM_SPECTRA_APP_URL defaults to http://0.0.0.0:3007.
const { createProxyMiddleware } = require('http-proxy-middleware');

const target = process.env.CHEM_SPECTRA_APP_URL || 'http://0.0.0.0:3007';

module.exports = (app) => {
  // eslint-disable-next-line no-console
  console.log(`[standalone] proxying /api/v1/chemspectra to ${target}`);
  app.use(
    createProxyMiddleware('/api/v1/chemspectra', { target, changeOrigin: true }),
  );
};
