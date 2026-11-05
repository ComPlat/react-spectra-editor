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
  // Node cuts a request whose upload takes longer than the server's requestTimeout (300 s)
  // with a 408. A large spectrum on a slow link can take that long, and the backend allows
  // more, so lift the limit; the backend's own limits still apply. setupProxy only gets the
  // app, so this is done from the first request that reaches the server.
  app.use('/api/v1/chemspectra', (req, res, next) => {
    const { server } = req.socket;
    if (server && server.requestTimeout !== 0) server.requestTimeout = 0;
    next();
  });
  app.use(
    createProxyMiddleware('/api/v1/chemspectra', { target, changeOrigin: true }),
  );
};
