import { waitFor } from '@testing-library/react';

import createClientStore from '../../../standalone/store';
import {
  FILE, FORM, MOL, PREDICT,
} from '../../../standalone/constants/action_type';
import { encodeJcamp, installFetch, formEntries } from '../../fixtures/standalone_client';
import nmr1HJcamp from '../../fixtures/nmr1h_jcamp';
import irJcamp from '../../fixtures/ir_jcamp';

const convertRoute = (source) => ({
  'file/convert': { status: true, jcamp: encodeJcamp(source), img: 'preview' },
});

const loadSpectrum = async (store, source = nmr1HJcamp, name = 'sample.jdx') => {
  store.dispatch({ type: FILE.ADD_INIT, payload: { file: new File(['raw'], name) } });
  await waitFor(() => expect(store.getState().file.src).toBeTruthy());
  store.dispatch({ type: FORM.SUBMIT, payload: {} });
  await waitFor(() => {
    const { jcamp, jcampList } = store.getState().file;
    expect(jcamp || jcampList).toBeTruthy();
  });
  return source;
};

describe('standalone client sagas', () => {
  afterEach(() => { delete (global as any).fetch; });

  it('converts an uploaded file into an extracted entity', async () => {
    const calls = installFetch(convertRoute(nmr1HJcamp));
    const store = createClientStore();
    await loadSpectrum(store);

    expect(calls[0].url).toBe('/api/v1/chemspectra/file/convert');
    const { file } = store.getState();
    expect(file.jcamp.layout).toBe('1H');
    expect(file.jcamp.features).toBeDefined();
    expect(file.dst).toBeInstanceOf(File);
    expect(file.dst.name).toBe('dst.jcamp');
    expect(file.jcampList).toBeFalsy();
  });

  it('converts a multi-spectrum response into jcampList and dstList', async () => {
    installFetch({
      'file/convert': {
        status: true,
        list_jcamps: [encodeJcamp(nmr1HJcamp), encodeJcamp(irJcamp)],
      },
    });
    const store = createClientStore();
    await loadSpectrum(store);

    const { file } = store.getState();
    expect(file.jcampList).toHaveLength(2);
    expect(file.dstList.map((f) => f.name)).toEqual(['dst_0.jcamp', 'dst_1.jcamp']);
  });

  it('rejects a file with an unsupported extension', async () => {
    installFetch(convertRoute(nmr1HJcamp));
    const store = createClientStore();
    store.dispatch({ type: FILE.ADD_INIT, payload: { file: new File(['x'], 'notes.txt') } });
    await waitFor(() => expect(store.getState().notice.status).toBe('error'));
    expect(store.getState().notice.message).toMatch(/Invalid File/);
    expect(store.getState().file.src).toBe(false);
  });

  it('posts every form field the backend expects on save', async () => {
    const calls = installFetch(convertRoute(nmr1HJcamp));
    (window.URL as any).createObjectURL = () => 'blob:zip';
    (window.URL as any).revokeObjectURL = () => {};
    const { click } = HTMLAnchorElement.prototype;
    HTMLAnchorElement.prototype.click = () => {};
    try {
      const store = createClientStore();
      await loadSpectrum(store);
      calls.length = 0;

      store.dispatch({
        type: FILE.SAVE_INIT,
        payload: {
          peakStr: '1,2',
          shift: { peak: { x: 7.26 }, ref: { name: 'CDCl3', value: 7.26 } },
          mass: 100,
          scan: 5,
          thres: 10,
          predict: '{"p":1}',
          integration: '{"i":1}',
          multiplicity: '{"m":1}',
          waveLength: '{"w":1}',
          cyclicvolta: '{"c":1}',
          dscMetaData: '{"d":1}',
        },
      });
      await waitFor(() => expect(calls).toHaveLength(1));

      const { url, options } = calls[0];
      expect(url).toBe('/api/v1/chemspectra/file/save');
      expect(options.method).toBe('post');
      const body = formEntries(options.body);
      expect(Object.keys(body).sort()).toEqual([
        'cyclic_volta', 'dsc_meta_data', 'dst', 'filename', 'integration', 'mass',
        'molfile', 'multiplicity', 'peaks_str', 'predict', 'scan', 'shift_ref_name',
        'shift_ref_value', 'shift_select_x', 'src', 'thres', 'wave_length',
      ]);
      expect(body.filename).toBe('sample');
      expect(body.peaks_str).toBe('1,2');
      expect(body.shift_select_x).toBe('7.26');
      expect(body.shift_ref_name).toBe('CDCl3');
      expect(body.shift_ref_value).toBe('7.26');
      expect(body.integration).toBe('{"i":1}');
      expect(body.multiplicity).toBe('{"m":1}');
      expect(body.wave_length).toBe('{"w":1}');
      expect(body.cyclic_volta).toBe('{"c":1}');
      expect(body.dsc_meta_data).toBe('{"d":1}');
      expect(body.src.name).toBe('sample.jdx');
      expect(body.dst.name).toBe('dst.jcamp');
    } finally {
      HTMLAnchorElement.prototype.click = click;
    }
  });

  it('also posts dst_list when the upload produced several spectra', async () => {
    const calls = installFetch({
      'file/convert': { status: true, list_jcamps: [encodeJcamp(nmr1HJcamp), encodeJcamp(irJcamp)] },
    });
    (window.URL as any).createObjectURL = () => 'blob:zip';
    (window.URL as any).revokeObjectURL = () => {};
    const { click } = HTMLAnchorElement.prototype;
    HTMLAnchorElement.prototype.click = () => {};
    try {
      const store = createClientStore();
      await loadSpectrum(store);
      calls.length = 0;
      store.dispatch({
        type: FILE.SAVE_INIT,
        payload: {
          peakStr: '', shift: false, scan: 1, thres: 1,
        },
      });
      await waitFor(() => expect(calls).toHaveLength(1));
      const body = formEntries(calls[0].options.body);
      expect(body.dst_list).toHaveLength(2);
    } finally {
      HTMLAnchorElement.prototype.click = click;
    }
  });

  it('converts a molfile and keeps the returned svg', async () => {
    const calls = installFetch({
      'molfile/convert': {
        status: true, smi: 'C', mass: 16.03, svg: '<svg/>',
      },
    });
    const store = createClientStore();
    store.dispatch({ type: MOL.ADD_INIT, payload: { mol: new File(['M  END'], 'a.mol') } });
    await waitFor(() => expect(store.getState().mol.svg).toBe('<svg/>'));
    expect(calls[0].url).toBe('/api/v1/chemspectra/molfile/convert');
    expect(store.getState().mol.mass).toBe(16.03);
  });

  it('predicts IR through the infrared endpoint and everything else through nmr_peaks_form', async () => {
    const calls = installFetch({
      'predict/infrared': { outline: { code: 200 }, output: { result: [] } },
      'predict/nmr_peaks_form': { outline: { code: 200 }, output: { result: [] } },
    });
    const store = createClientStore();
    const molfile = new File(['M  END'], 'a.mol');
    const spectrum = new File(['raw'], 'a.jdx');

    store.dispatch({
      type: PREDICT.PREDICT_INIT,
      payload: { layout: 'IR', molfile, spectrum },
    });
    await waitFor(() => expect(calls).toHaveLength(1));
    expect(calls[0].url).toBe('/api/v1/chemspectra/predict/infrared');

    store.dispatch({
      type: PREDICT.PREDICT_INIT,
      payload: {
        layout: '1H', molfile, peaks: [{ x: 1, y: 2 }], shift: { ref: {} },
      },
    });
    await waitFor(() => expect(calls).toHaveLength(2));
    expect(calls[1].url).toBe('/api/v1/chemspectra/predict/nmr_peaks_form');
  });

  it('survives a prediction response without an outline', async () => {
    // e.g. an error body from the backend; this used to throw inside the saga and
    // cancel every client saga, so nothing worked afterwards
    const calls = installFetch({
      'predict/nmr_peaks_form': { error: 'boom' },
      'predict/infrared': { outline: { code: 200 }, output: { result: [] } },
    });
    const store = createClientStore();
    const molfile = new File(['M  END'], 'a.mol');
    const spectrum = new File(['raw'], 'a.jdx');

    store.dispatch({
      type: PREDICT.PREDICT_INIT,
      payload: {
        layout: '1H', molfile, peaks: [], shift: { ref: {} },
      },
    });
    await waitFor(() => expect(calls).toHaveLength(1));
    await waitFor(() => expect(store.getState().notice.status).toBe('warning'));
    expect(store.getState().notice.message).toBe('Server not available!');

    store.dispatch({
      type: PREDICT.PREDICT_INIT,
      payload: { layout: 'IR', molfile, spectrum },
    });
    await waitFor(() => expect(calls).toHaveLength(2));
    expect(calls[1].url).toBe('/api/v1/chemspectra/predict/infrared');
  });
});
