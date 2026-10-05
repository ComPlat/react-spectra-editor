import { buildSavePayload } from '../../../standalone/components/content';

// What the standalone client posts on save, built from the editor's Submit payload.
const entry = {
  shift: { ref: { name: 'CDCl3', value: 7.26, label: 'CDCl3' }, peak: false, enable: true },
  integration: { stack: [{ xL: 1, xU: 2, area: 1 }], refArea: 1, refFactor: 1, shift: 0 },
  multiplicity: { stack: [], shift: 0, smExtext: false, edited: false },
};
const peaks = [{ x: 7.26, y: 1 }, { x: 3.5, y: 2 }];

const payloadFor = (curveIdx: number, curve: object) => {
  const spectraList = [];
  spectraList[curveIdx] = {
    peaks, scan: 1, thres: 10, analysis: {}, waveLength: {}, cyclicvoltaSt: {}, dscMetaData: {},
    ...curve,
  };
  return { spectra_list: spectraList, curveSt: { curveIdx } };
};

describe('buildSavePayload', () => {
  it('posts the selected curve\'s own shift, integration and multiplicity', () => {
    const body = buildSavePayload(payloadFor(1, entry), 120.5);
    expect(body.shift).toEqual(entry.shift);
    expect(JSON.parse(body.integration)).toEqual(entry.integration);
    expect(JSON.parse(body.multiplicity)).toEqual(entry.multiplicity);
    expect(body.mass).toBe(120.5);
    // the solvent reference peak is removed, as the editor's rmRef does
    expect(body.peakStr).not.toMatch(/7\.26/);
    expect(body.peakStr).toMatch(/3\.5/);
  });

  it('saves a curve the editor holds no entries for without another curve\'s data', () => {
    // The editor falls back to the whole slice when its list is shorter than the curve
    // list, so the selected curve has no entry of its own.
    const slices = {
      shift: { shifts: [entry.shift] },
      integration: { integrations: [entry.integration] },
      multiplicity: { multiplicities: [entry.multiplicity] },
    };
    const body = buildSavePayload(payloadFor(1, slices), false);
    expect(body.shift).toBeUndefined();
    expect(body.integration).toBe('{}');
    expect(body.multiplicity).toBe('{}');
    expect(body.peakStr).toMatch(/7\.26/);
  });
});
