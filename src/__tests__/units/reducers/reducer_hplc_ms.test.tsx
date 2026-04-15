import hplcMsReducer from "../../../reducers/reducer_hplc_ms";
import { CURVE, HPLC_MS } from "../../../constants/action_type";

const createTicCurve = (polarity: 'positive' | 'negative' | 'neutral', x = [1, 2], y = [10, 20]) => ({
  csCategory: ['tic', polarity],
  features: [{ data: [{ x, y }] }],
});

const createUvvisCurve = () => ({
  csCategory: ['uvvis'],
  features: [
    {
      pageSymbol: 'Wavelength=210',
      data: [{ x: [1, 2], y: [0.1, 0.2] }],
      integrations: [{ xL: 1, xU: 2 }],
      peaks: [{ x: 1.5, y: 0.15 }],
    },
    {
      pageValue: '220',
      data: [{ x: [3, 4], y: [0.3, 0.4] }],
      integrations: [{ xL: 3, xU: 4 }],
      peaks: [{ x: 3.5, y: 0.35 }],
    },
  ],
});

const createMzCurve = (polarity: 'positive' | 'negative' | 'neutral') => ({
  csCategory: ['mz', polarity],
  features: [{ data: [{ x: [100, 101], y: [5, 6] }] }],
});

describe('Test redux reducer_hplc_ms', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('gets default state', () => {
    const state = hplcMsReducer(undefined, { type: '@@INIT' } as any);
    expect(state.layout).toEqual('LC/MS');
    expect(state.tic.polarity).toEqual('positive');
    expect(state.uvvis.spectraList).toEqual([]);
    expect(state.lcmsIntegrationsExport).toEqual('percent');
    expect(state.lcmsDatasetKey).toEqual(null);
  });

  it('sets lcmsIntegrationsExport and normalizes invalid values', () => {
    const s0 = hplcMsReducer(undefined, { type: '@@INIT' } as any);
    const s1 = hplcMsReducer(s0, {
      type: HPLC_MS.SET_LCMS_INTEGRATIONS_EXPORT,
      payload: { lcmsIntegrationsExport: 'both' },
    } as any);
    expect(s1.lcmsIntegrationsExport).toEqual('both');
    const s2 = hplcMsReducer(s1, {
      type: HPLC_MS.SET_LCMS_INTEGRATIONS_EXPORT,
      payload: { lcmsIntegrationsExport: 'invalid' },
    } as any);
    expect(s2.lcmsIntegrationsExport).toEqual('percent');
  });

  it('sets LCMS curves and applies TIC fallback polarity', () => {
    const action = {
      type: CURVE.SET_ALL_CURVES,
      payload: [
        createTicCurve('negative'),
        createUvvisCurve(),
        createMzCurve('positive'),
      ],
    };

    const state = hplcMsReducer(undefined, action as any);

    expect(state.uvvis.listWaveLength).toEqual([210, 220]);
    expect(state.uvvis.selectedWaveLength).toEqual(210);
    expect(state.uvvis.currentSpectrum.pageValue).toEqual(210);

    expect(state.tic.available).toEqual({
      positive: false,
      negative: true,
      neutral: false,
    });
    expect(state.tic.polarity).toEqual('negative');
    expect(state.tic.negative.data.x).toEqual([1, 2]);

    expect(state.ms.positive.peaks[0]).toEqual([
      { x: 100, y: 5 },
      { x: 101, y: 6 },
    ]);
  });

  it('keeps previous state when SET_ALL_CURVES does not contain UVVIS', () => {
    const initial = hplcMsReducer(undefined, { type: '@@INIT' } as any);
    const action = {
      type: CURVE.SET_ALL_CURVES,
      payload: [createTicCurve('positive')],
    };

    const next = hplcMsReducer(initial, action as any);
    expect(next).toBe(initial);
  });

  it('clears integrations and peaks for all UVVIS spectra', () => {
    const hydrated = hplcMsReducer(undefined, {
      type: CURVE.SET_ALL_CURVES,
      payload: [createTicCurve('positive'), createUvvisCurve()],
    } as any);

    const withSelectedSpectrum = hplcMsReducer(hydrated, {
      type: HPLC_MS.UPDATE_UVVIS_WAVE_LENGTH,
      payload: { target: { value: 220 } },
    } as any);

    expect(withSelectedSpectrum.uvvis.currentSpectrum?.pageValue).toEqual(220);
    expect(withSelectedSpectrum.uvvis.spectraList[1].integrations.length).toBeGreaterThan(0);
    expect(withSelectedSpectrum.uvvis.spectraList[1].peaks.length).toBeGreaterThan(0);

    const clearedIntegrations = hplcMsReducer(withSelectedSpectrum, {
      type: HPLC_MS.CLEAR_INTEGRATION_ALL_HPLCMS,
    } as any);
    expect(clearedIntegrations.uvvis.spectraList.every((sp: any) => sp.integrations.length === 0)).toEqual(true);

    const clearedPeaks = hplcMsReducer(clearedIntegrations, {
      type: HPLC_MS.CLEAR_ALL_PEAKS_HPLCMS,
    } as any);
    expect(clearedPeaks.uvvis.spectraList.every((sp: any) => sp.peaks.length === 0)).toEqual(true);
    expect(clearedPeaks.uvvis.currentSpectrum?.pageValue).toEqual(220);
  });

  it('restores TIC RT from sessionStorage for the same dataset id', () => {
    const payload = [
      createTicCurve('positive', [1, 2, 3], [10, 20, 30]),
      createUvvisCurve(),
      createMzCurve('positive'),
    ];
    let state = hplcMsReducer(undefined, {
      type: CURVE.SET_ALL_CURVES,
      payload,
      meta: { idDt: 'persist-rt-1' },
    } as any);
    state = hplcMsReducer(state, {
      type: HPLC_MS.UPDATE_CURRENT_PAGE_VALUE,
      payload: { currentPageValue: 2 },
    } as any);
    const cleared = hplcMsReducer(undefined, { type: '@@INIT' } as any);
    expect(cleared.tic.currentPageValue).toEqual(null);
    const reloaded = hplcMsReducer(cleared, {
      type: CURVE.SET_ALL_CURVES,
      payload,
      meta: { idDt: 'persist-rt-1' },
    } as any);
    expect(reloaded.tic.currentPageValue).toEqual(2);
  });

  it('restores TIC polarity and RT page from meta (ELN / JCAMP reopen)', () => {
    const payload = [
      createTicCurve('negative', [1, 2, 3], [10, 20, 30]),
      createUvvisCurve(),
      createMzCurve('negative'),
    ];
    const state = hplcMsReducer(undefined, {
      type: CURVE.SET_ALL_CURVES,
      payload,
      meta: { lcmsPolarity: 'negative', lcmsMzPage: 2 },
    } as any);
    expect(state.tic.polarity).toEqual('negative');
    expect(state.tic.currentPageValue).toEqual(2);
  });

  it('restores TIC RT from UVVIS ##$CSLCMSMZPAGE (lcms_mz_page on uvvis curve)', () => {
    const uvvis = { ...createUvvisCurve(), lcms_mz_page: 2 };
    const payload = [
      createTicCurve('positive', [1, 2, 3], [10, 20, 30]),
      uvvis,
      createMzCurve('positive'),
    ];
    const state = hplcMsReducer(undefined, {
      type: CURVE.SET_ALL_CURVES,
      payload,
    } as any);
    expect(state.tic.currentPageValue).toEqual(2);
  });

  it('selects wavelength from meta.lcmsUvvisWavelength when nothing to restore from state', () => {
    const payload = [
      createTicCurve('positive'),
      createUvvisCurve(),
      createMzCurve('positive'),
    ];
    const state = hplcMsReducer(undefined, {
      type: CURVE.SET_ALL_CURVES,
      payload,
      meta: { idDt: 'test-dt', lcmsUvvisWavelength: 220 },
    } as any);
    expect(state.uvvis.selectedWaveLength).toEqual(220);
    expect(state.uvvis.wavelengthIdx).toEqual(1);
    expect(state.lcmsDatasetKey).toEqual('test-dt');
  });

  it('preserves selected wavelength when SET_ALL_CURVES reloads the same UVVIS order', () => {
    const payload = [
      createTicCurve('positive'),
      createUvvisCurve(),
      createMzCurve('positive'),
    ];
    let state = hplcMsReducer(undefined, { type: CURVE.SET_ALL_CURVES, payload } as any);
    state = hplcMsReducer(state, {
      type: HPLC_MS.UPDATE_UVVIS_WAVE_LENGTH,
      payload: { target: { value: 220 } },
    } as any);
    expect(state.uvvis.selectedWaveLength).toEqual(220);
    const reloaded = hplcMsReducer(state, { type: CURVE.SET_ALL_CURVES, payload } as any);
    expect(reloaded.uvvis.selectedWaveLength).toEqual(220);
    expect(reloaded.uvvis.wavelengthIdx).toEqual(1);
  });

  it('restores selected wavelength after a full reset with a new dataset id', () => {
    const payload = [
      createTicCurve('positive'),
      createUvvisCurve(),
      createMzCurve('positive'),
    ];
    let state = hplcMsReducer(undefined, {
      type: CURVE.SET_ALL_CURVES,
      payload,
      meta: { idDt: 'before-save' },
    } as any);
    state = hplcMsReducer(state, {
      type: HPLC_MS.UPDATE_UVVIS_WAVE_LENGTH,
      payload: { target: { value: 220 } },
    } as any);

    const resetState = hplcMsReducer(undefined, { type: '@@INIT' } as any);
    const reloaded = hplcMsReducer(resetState, {
      type: CURVE.SET_ALL_CURVES,
      payload,
      meta: { idDt: 'after-save' },
    } as any);

    expect(reloaded.uvvis.selectedWaveLength).toEqual(220);
    expect(reloaded.uvvis.wavelengthIdx).toEqual(1);
  });

  it('uvvis undo/redo restores peaks after UPDATE_HPLCMS_PEAKS', () => {
    const payload = [
      createTicCurve('positive'),
      createUvvisCurve(),
      createMzCurve('positive'),
    ];
    let state = hplcMsReducer(undefined, { type: CURVE.SET_ALL_CURVES, payload } as any);
    const origPeaks = state.uvvis.spectraList[0].peaks;
    state = hplcMsReducer(state, {
      type: HPLC_MS.UPDATE_HPLCMS_PEAKS,
      payload: {
        spectrumId: state.uvvis.listWaveLength[0],
        peaks: [...origPeaks, { x: 5, y: 0.5 }],
      },
    } as any);
    expect(state.uvvis.spectraList[0].peaks.length).toEqual(origPeaks.length + 1);
    expect(state.uvvisEditHistory.past.length).toEqual(1);
    state = hplcMsReducer(state, { type: HPLC_MS.UVVIS_UNDO } as any);
    expect(state.uvvis.spectraList[0].peaks).toEqual(origPeaks);
    expect(state.uvvisEditHistory.future.length).toEqual(1);
    state = hplcMsReducer(state, { type: HPLC_MS.UVVIS_REDO } as any);
    expect(state.uvvis.spectraList[0].peaks.length).toEqual(origPeaks.length + 1);
  });
});
