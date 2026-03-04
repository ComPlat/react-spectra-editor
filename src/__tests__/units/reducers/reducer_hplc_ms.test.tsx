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
  it('gets default state', () => {
    const state = hplcMsReducer(undefined, { type: '@@INIT' } as any);
    expect(state.layout).toEqual('LC/MS');
    expect(state.tic.polarity).toEqual('positive');
    expect(state.uvvis.spectraList).toEqual([]);
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
});
