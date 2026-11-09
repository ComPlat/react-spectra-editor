// The dev server's entry. `yarn start` serves the standalone ChemSpectra client, `yarn start:dev`
// the editor dev page (scripts/start.js sets REACT_APP_PAGE). Each loads only its own code. Never
// compiled into dist: the package entry is app.js.
if (process.env.REACT_APP_PAGE === 'dev') {
  import('./dev/index');
} else {
  import('./standalone_page');
}
