// Dev server only (react-scripts start; never compiled into dist). Proxies the
// ChemSpectra backend so the standalone client can be tried locally:
//   CHEM_SPECTRA_APP_URL=https://your-backend yarn start
// react-scripts loads this file for every start, so it only acts for the client's
// (scripts/start.js sets REACT_APP_PAGE).
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  if (process.env.REACT_APP_PAGE !== 'standalone') return;

  const target = process.env.CHEM_SPECTRA_APP_URL;
  // eslint-disable-next-line no-console
  console.log(`[standalone] proxying /api/v1/chemspectra to ${target}`);
  app.use(
    createProxyMiddleware('/api/v1/chemspectra', { target, changeOrigin: true }),
  );
};
