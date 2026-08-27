import { reconcileLcMsTimeAxes, maxTimeOf } from '../../../../../features/lc-ms/entities/timeAxis';

// Shaped after the real converter output. example2 (X32962) emits a UV/VIS axis in seconds
// labelled `##XUNITS=MINUTES` beside a TIC in genuine minutes; example1 (SVS-486F3) is
// consistent. The numbers below are the measured spans of those two datasets.
const uvvis = (maxX, extra = {}) => ({
  layout: 'LC/MS',
  spectra: [{
    dataType: 'HPLC UV-VIS',
    csCategory: 'UVVIS PEAK TABLE',
    xUnit: 'MINUTES',
    data: [{ x: [0, maxX / 2, maxX], y: [1, 2, 3] }],
    maxX,
    minX: 0,
    ...extra,
  }],
});

const tic = (maxX) => ({
  layout: 'LC/MS',
  spectra: [{
    dataType: 'MASS TIC',
    xUnit: 'MINUTES',
    data: [{ x: [0, maxX / 2, maxX], y: [10, 20, 30] }],
  }],
});

const mz = (maxX) => ({
  layout: 'LC/MS',
  spectra: [{
    dataType: 'MASS SPECTRUM',
    xUnit: 'm/z',
    page: 'T= 1.0',
    pageValue: 1.0,
    data: [{ x: [100, maxX / 2, maxX], y: [5, 6, 7] }],
  }],
});

const xOf = (entity) => entity.spectra[0].data[0].x;

describe('reconcileLcMsTimeAxes', () => {
  it('rescales a UV/VIS trace that is ~60x its TIC, the example2 case', () => {
    const [fixedUvvis, fixedTic] = reconcileLcMsTimeAxes([uvvis(599.825), tic(9.9994)]);
    expect(xOf(fixedUvvis)[2]).toBeCloseTo(9.997, 3);
    // the TIC is the reference and must not move
    expect(xOf(fixedTic)[2]).toBeCloseTo(9.9994, 4);
  });

  it('leaves a consistent group alone, the example1 case', () => {
    const entities = [uvvis(19.9613), tic(15.98)];
    const out = reconcileLcMsTimeAxes(entities);
    // returned by reference, so an unnecessary re-render is not triggered either
    expect(out).toBe(entities);
    expect(xOf(out[0])[2]).toBeCloseTo(19.9613, 4);
  });

  it('never rescales the m/z entity, whose x is m/z rather than time', () => {
    // m/z runs to ~1450 against a 10-minute TIC; only the kind gate keeps it safe if the
    // ratio window is ever widened.
    const entities = [mz(1448.2), tic(9.9994)];
    const out = reconcileLcMsTimeAxes(entities);
    expect(xOf(out[0])[2]).toBeCloseTo(1448.2, 3);
  });

  it('does nothing without a TIC to compare against', () => {
    const entities = [uvvis(599.825), mz(1448.2)];
    expect(reconcileLcMsTimeAxes(entities)).toBe(entities);
  });

  it('does nothing for a lone entity, or a non-array input', () => {
    const one = [uvvis(599.825)];
    expect(reconcileLcMsTimeAxes(one)).toBe(one);
    expect(reconcileLcMsTimeAxes([])).toEqual([]);
    expect(reconcileLcMsTimeAxes(undefined)).toEqual([]);
  });

  it('ignores a ratio that is merely large but not a unit mismatch', () => {
    // 20x is not 60x: a real span difference, however odd, is not evidence of seconds.
    const entities = [uvvis(200), tic(10)];
    expect(reconcileLcMsTimeAxes(entities)).toBe(entities);
  });

  it('scales peaks, integrations and the cached extrema, not just the data block', () => {
    const entities = [
      uvvis(599.825, {
        peaks: [{ x: 300, y: 5 }],
        integrations: [{ xL: 60, xU: 120, xExtent: { xL: 60, xU: 120 } }],
      }),
      tic(9.9994),
    ];
    const [fixed] = reconcileLcMsTimeAxes(entities);
    const s = fixed.spectra[0];
    expect(s.peaks[0].x).toBeCloseTo(5, 6);
    expect(s.integrations[0].xL).toBeCloseTo(1, 6);
    expect(s.integrations[0].xU).toBeCloseTo(2, 6);
    expect(s.integrations[0].xExtent).toEqual({ xL: 1, xU: 2 });
    expect(s.maxX).toBeCloseTo(9.997, 3);
    expect(s.minX).toBeCloseTo(0, 6);
    // the label was the thing that lied; leave it agreeing with the data
    expect(s.xUnit).toEqual('MINUTES');
  });

  it('does not mutate the entities it was given', () => {
    const entities = [uvvis(599.825), tic(9.9994)];
    reconcileLcMsTimeAxes(entities);
    expect(xOf(entities[0])[2]).toBeCloseTo(599.825, 3);
  });
});

describe('maxTimeOf', () => {
  it('reads the largest x across data blocks', () => {
    expect(maxTimeOf(tic(9.9994))).toBeCloseTo(9.9994, 4);
  });

  it('returns null when there is no usable x', () => {
    expect(maxTimeOf({})).toBeNull();
    expect(maxTimeOf({ spectra: [{ data: [{ x: [] }] }] })).toBeNull();
    expect(maxTimeOf({ spectra: [{ data: [{ x: [NaN, undefined] }] }] })).toBeNull();
  });
});
