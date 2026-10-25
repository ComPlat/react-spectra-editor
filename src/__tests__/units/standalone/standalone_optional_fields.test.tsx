import { waitFor } from '@testing-library/react';

import createClientStore from '../../../standalone/store';
import { FILE, FORM } from '../../../standalone/constants/action_type';
import {
  encodeJcamp, installFetch, formEntries,
} from '../../fixtures/standalone_client';
import irJcamp from '../../fixtures/ir_jcamp';

// chem-spectra-app parses wave_length, cyclic_volta and dsc_meta_data as JSON. A value the
// editor does not have must be left out: sent as the string "undefined", it fails to parse and
// the backend answers 500. Refresh never has the first two, and only some layouts have the third.
const loadSpectrum = async (store) => {
  store.dispatch({ type: FILE.ADD_INIT, payload: { file: new File(['raw'], 'sample.jdx') } });
  await waitFor(() => expect(store.getState().file.src).toBeTruthy());
  store.dispatch({ type: FORM.SUBMIT, payload: {} });
  await waitFor(() => expect(store.getState().file.jcamp).toBeTruthy());
};

const sentValues = (calls, route) => Object.entries(
  formEntries(calls.find((c) => c.url.endsWith(route)).options.body),
);

describe('standalone client: optional fields', () => {
  beforeEach(() => {
    (window.URL as any).createObjectURL = () => 'blob:x';
    (window.URL as any).revokeObjectURL = () => {};
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
    delete (global as any).fetch;
  });

  it('refresh sends no field as "undefined"', async () => {
    const calls = installFetch({
      'file/convert': { status: true, jcamp: encodeJcamp(irJcamp), img: 'p' },
      'file/refresh': { status: true, jcamp: encodeJcamp(irJcamp), img: 'p' },
    });
    const store = createClientStore();
    await loadSpectrum(store);
    store.dispatch({
      type: FILE.REFRESH_INIT,
      payload: { peakStr: '', shift: { peak: false, ref: { name: '-', value: 0 } } },
    });
    await waitFor(() => expect(calls.some((c) => c.url.endsWith('file/refresh'))).toBe(true));
    const values = sentValues(calls, 'file/refresh');
    expect(values.filter(([, v]) => v === 'undefined').map(([k]) => k)).toEqual([]);
  });

  it('save sends no field as "undefined" when the layout has no DSC metadata', async () => {
    const calls = installFetch({
      'file/convert': { status: true, jcamp: encodeJcamp(irJcamp), img: 'p' },
    });
    const store = createClientStore();
    await loadSpectrum(store);
    store.dispatch({ type: FILE.SAVE_INIT, payload: { peakStr: '', scan: 1, thres: 1 } });
    await waitFor(() => expect(calls.some((c) => c.url.endsWith('file/save'))).toBe(true));
    const values = sentValues(calls, 'file/save');
    expect(values.filter(([, v]) => v === 'undefined').map(([k]) => k)).toEqual([]);
  });
});
