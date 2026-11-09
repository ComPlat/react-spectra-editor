// The standalone client must stay a separate entry point: hosts that only embed the
// editor must not load the upload UI, store or sagas by importing the package main.
const mockLoaded = { standalone: false };
jest.mock('../../../standalone/index', () => {
  mockLoaded.standalone = true;
  return {};
});
jest.mock('../../../standalone/store', () => {
  mockLoaded.standalone = true;
  return {};
});

describe('package main entry', () => {
  it('does not load anything from standalone/', () => {
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      const editor = require('../../../app');
      expect(editor.SpectraEditor).toBeDefined();
      expect(editor.FN).toBeDefined();
    });
    expect(mockLoaded.standalone).toBe(false);
  });
});
