import { waitFor } from '@testing-library/react';

import createClientStore from '../../../standalone/store';
import {
  FILE, FORM, JCAMP, MOL,
} from '../../../standalone/constants/action_type';
import {
  encodeJcamp, installFetch, refusal, formEntries,
} from '../../fixtures/standalone_client';
import irJcamp from '../../fixtures/ir_jcamp';

// chem-spectra-app refuses a request it cannot process with HTTP 422 and { error } saying
// why (for example a 2D NMR file). The client must show that reason, not a generic notice,
// and a refused save must not download the error body as a zip.
const REASON = 'this is a 2D NMR file (##NUM DIM= 2). ChemSpectra handles 1D spectra only';

const loadSpectrum = async (store) => {
  store.dispatch({ type: FILE.ADD_INIT, payload: { file: new File(['raw'], 'sample.jdx') } });
  await waitFor(() => expect(store.getState().file.src).toBeTruthy());
  store.dispatch({ type: FORM.SUBMIT, payload: {} });
};

describe('standalone client: refusals from the backend', () => {
  let clicks: number;
  let objectUrls: number;

  beforeEach(() => {
    clicks = 0;
    objectUrls = 0;
    (window.URL as any).createObjectURL = () => { objectUrls += 1; return 'blob:x'; };
    (window.URL as any).revokeObjectURL = () => {};
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => { clicks += 1; });
  });
  afterEach(() => {
    jest.restoreAllMocks();
    delete (global as any).fetch;
  });

  it('shows why a file could not be converted', async () => {
    installFetch({ 'file/convert': refusal(REASON) });
    const store = createClientStore();
    await loadSpectrum(store);
    await waitFor(() => expect(store.getState().notice.status).toBe('error'));
    expect(store.getState().notice.message).toContain(REASON);
    expect(store.getState().loading).toBe(false);
  });

  it('keeps the generic notice when the backend gives no reason', async () => {
    installFetch({ 'file/convert': { status: false } });
    const store = createClientStore();
    await loadSpectrum(store);
    await waitFor(() => expect(store.getState().notice.status).toBe('error'));
    expect(store.getState().notice.message).toBe('Conversion error!');
  });

  it('shows why a molfile could not be converted', async () => {
    installFetch({ 'molfile/convert': refusal('the molfile could not be read') });
    const store = createClientStore();
    store.dispatch({ type: MOL.ADD_INIT, payload: { mol: new File(['M  END'], 'a.mol') } });
    await waitFor(() => expect(store.getState().notice.status).toBe('error'));
    expect(store.getState().notice.message).toContain('the molfile could not be read');
  });

  it('shows why a comparison spectrum could not be added', async () => {
    installFetch({ 'file/convert': refusal(REASON) });
    const store = createClientStore();
    store.dispatch({
      type: JCAMP.ADD_OTHERS_INIT,
      payload: { jcamps: [new File(['raw'], 'other.jdx')] },
    });
    await waitFor(() => expect(store.getState().notice.status).toBe('error'));
    expect(store.getState().notice.message).toContain(REASON);
  });

  it('shows why a refresh was refused', async () => {
    const calls = installFetch({
      'file/convert': { status: true, jcamp: encodeJcamp(irJcamp), img: 'p' },
      'file/refresh': refusal(REASON),
    });
    const store = createClientStore();
    await loadSpectrum(store);
    await waitFor(() => expect(store.getState().file.jcamp).toBeTruthy());
    store.dispatch({
      type: FILE.REFRESH_INIT,
      payload: { peakStr: '', shift: { peak: false, ref: { name: '-', value: 0 } } },
    });
    await waitFor(() => expect(calls.some((c) => c.url.endsWith('file/refresh'))).toBe(true));
    await waitFor(() => expect(store.getState().notice.status).toBe('error'));
    expect(store.getState().notice.message).toContain(REASON);
  });

  it('does not download a refused save, and shows why', async () => {
    const calls = installFetch({
      'file/convert': { status: true, jcamp: encodeJcamp(irJcamp), img: 'p' },
      'file/save': refusal(REASON),
    });
    const store = createClientStore();
    await loadSpectrum(store);
    await waitFor(() => expect(store.getState().file.jcamp).toBeTruthy());
    store.dispatch({ type: FILE.SAVE_INIT, payload: { peakStr: '', scan: 1, thres: 1 } });
    await waitFor(() => expect(store.getState().notice.message).toContain(REASON));
    expect(store.getState().notice.status).toBe('error');
    expect(store.getState().loading).toBe(false);
    expect(clicks).toBe(0);
    expect(objectUrls).toBe(0);
    expect(formEntries(calls.find((c) => c.url.endsWith('file/save')).options.body).filename)
      .toBe('sample');
  });

  it('reports a save that never reached the backend', async () => {
    installFetch({ 'file/convert': { status: true, jcamp: encodeJcamp(irJcamp), img: 'p' } });
    const store = createClientStore();
    await loadSpectrum(store);
    await waitFor(() => expect(store.getState().file.jcamp).toBeTruthy());
    global.fetch = () => Promise.reject(new TypeError('Failed to fetch'));
    jest.spyOn(console, 'log').mockImplementation(() => {});
    store.dispatch({ type: FILE.SAVE_INIT, payload: { peakStr: '', scan: 1, thres: 1 } });
    await waitFor(() => expect(store.getState().notice.status).toBe('error'));
    expect(store.getState().notice.message).toBe('Save error!');
    expect(store.getState().loading).toBe(false);
    expect(clicks).toBe(0);
  });

  it('still downloads an accepted save', async () => {
    installFetch({ 'file/convert': { status: true, jcamp: encodeJcamp(irJcamp), img: 'p' } });
    const store = createClientStore();
    await loadSpectrum(store);
    await waitFor(() => expect(store.getState().file.jcamp).toBeTruthy());
    store.dispatch({ type: FILE.SAVE_INIT, payload: { peakStr: '', scan: 1, thres: 1 } });
    await waitFor(() => expect(clicks).toBe(1));
    await waitFor(() => expect(store.getState().loading).toBe(false));
    expect(store.getState().notice.status).not.toBe('error');
  });
});
