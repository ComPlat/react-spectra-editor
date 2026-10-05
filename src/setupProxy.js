// Dev server only (react-scripts start; never compiled into dist). Proxies the
// ChemSpectra backend so the standalone client can be tried locally:
//   yarn start:standalone   (CHEM_SPECTRA_APP_URL defaults to http://0.0.0.0:3007)
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  app.use(
    createProxyMiddleware('/api/v1/chemspectra', {
      target: process.env.CHEM_SPECTRA_APP_URL || 'http://0.0.0.0:3007',
      changeOrigin: true,
    }),
  );
};
