import {
  formatLcmsPeaksForBackend,
  formatLcmsIntegralsForBackend,
  getLcmsMzPageData,
} from '../../../../../features/lc-ms/submit/peaks';

describe('lc-ms/submit peaks — backend payload shape', () => {
  describe('formatLcmsPeaksForBackend', () => {
    it('returns empty array when state is missing or has no spectraList', () => {
      expect(formatLcmsPeaksForBackend(null)).toEqual([]);
      expect(formatLcmsPeaksForBackend({})).toEqual([]);
      expect(formatLcmsPeaksForBackend({ uvvis: {} })).toEqual([]);
      expect(formatLcmsPeaksForBackend({ uvvis: { spectraList: null } })).toEqual([]);
    });

    it('adds wavelength from spectrum pageValue to each peak (single channel)', () => {
      const hplcMsSt = {
        uvvis: {
          spectraList: [
            {
              pageValue: 254,
              peaks: [
                { x: 1.2, y: 10, _meta: 'a' },
                { x: 3.4, y: 20 },
              ],
            },
          ],
        },
      };
      const out = formatLcmsPeaksForBackend(hplcMsSt);
      expect(out).toEqual([
        { x: 1.2, y: 10, _meta: 'a', wavelength: 254 },
        { x: 3.4, y: 20, wavelength: 254 },
      ]);
    });

    it('flattens peaks from multiple UV channels with distinct wavelengths', () => {
      const hplcMsSt = {
        uvvis: {
          spectraList: [
            { pageValue: 230, peaks: [{ x: 0.1, y: 1 }] },
            { pageValue: 280, peaks: [{ x: 0.2, y: 2 }, { x: 0.3, y: 3 }] },
            { pageValue: 210, peaks: [] },
          ],
        },
      };
      const out = formatLcmsPeaksForBackend(hplcMsSt);
      expect(out).toHaveLength(3);
      expect(out[0]).toMatchObject({ x: 0.1, wavelength: 230 });
      expect(out[1]).toMatchObject({ x: 0.2, wavelength: 280 });
      expect(out[2]).toMatchObject({ x: 0.3, wavelength: 280 });
    });

    it('ignores spectra with no peaks', () => {
      const hplcMsSt = {
        uvvis: {
          spectraList: [
            { pageValue: 254, peaks: [] },
            { pageValue: 230, peaks: [{ x: 1, y: 1 }] },
          ],
        },
      };
      expect(formatLcmsPeaksForBackend(hplcMsSt)).toEqual([
        { x: 1, y: 1, wavelength: 230 },
      ]);
    });
  });

  describe('formatLcmsIntegralsForBackend', () => {
    it('returns empty when no integrals', () => {
      expect(formatLcmsIntegralsForBackend(null)).toEqual([]);
      expect(formatLcmsIntegralsForBackend({ uvvis: { spectraList: [] } })).toEqual([]);
    });

    it('maps integration fields to backend keys (from, to, value, integral, wavelength)', () => {
      const hplcMsSt = {
        uvvis: {
          spectraList: [
            {
              pageValue: 254,
              integrations: [
                { xL: 1, xU: 2, area: 100, absoluteArea: 1000 },
                { xL: 3, xU: 4, area: 50, absoluteArea: 500 },
              ],
            },
          ],
        },
      };
      expect(formatLcmsIntegralsForBackend(hplcMsSt)).toEqual([
        { from: 1, to: 2, value: 100, integral: 1000, wavelength: 254 },
        { from: 3, to: 4, value: 50, integral: 500, wavelength: 254 },
      ]);
    });
  });

  describe('getLcmsMzPageData', () => {
    it('returns null when tic or ms is missing', () => {
      expect(getLcmsMzPageData(null)).toBeNull();
      expect(getLcmsMzPageData({})).toBeNull();
      expect(getLcmsMzPageData({ tic: {} })).toBeNull();
      expect(getLcmsMzPageData({ ms: {} })).toBeNull();
    });

    it('returns null when TIC x axis is missing or currentPageValue is not finite', () => {
      const base = {
        tic: {
          polarity: 'positive',
          currentPageValue: 0.5,
          positive: { data: {} },
        },
        ms: { positive: { pageValues: [0.5], peaks: [[{ x: 100, y: 1 }]] } },
      };
      expect(getLcmsMzPageData({ ...base, tic: { ...base.tic, currentPageValue: NaN } })).toBeNull();
    });

    it('returns null when RT does not match any TIC point or page value', () => {
      const hplcMsSt = {
        tic: {
          polarity: 'positive',
          currentPageValue: 0.99,
          positive: { data: { x: [0.1, 0.2] } },
        },
        ms: {
          positive: {
            pageValues: [0.1, 0.2],
            peaks: [[{ x: 50, y: 1 }], [{ x: 60, y: 2 }]],
          },
        },
      };
      expect(getLcmsMzPageData(hplcMsSt)).toBeNull();
    });

    it('resolves MS peak array for positive polarity via pageValues', () => {
      const peakRow = [{ x: 120.1, y: 999 }, { x: 121, y: 1 }];
      const hplcMsSt = {
        tic: {
          polarity: 'positive',
          currentPageValue: 0.5,
          positive: { data: { x: [0.4, 0.5, 0.6] } },
        },
        ms: {
          positive: {
            pageValues: [0.4, 0.5, 0.6],
            peaks: [[], peakRow, []],
          },
        },
      };
      expect(getLcmsMzPageData(hplcMsSt)).toEqual(peakRow);
    });

    it('uses negative polarity and matching pageValues', () => {
      const peakRow = [{ x: 200, y: 1 }];
      const hplcMsSt = {
        tic: {
          polarity: 'negative',
          currentPageValue: 1.0,
          negative: { data: { x: [1.0] } },
        },
        ms: {
          negative: {
            pageValues: [1.0],
            peaks: [peakRow],
          },
        },
      };
      expect(getLcmsMzPageData(hplcMsSt)).toEqual(peakRow);
    });

    it('falls back to TIC x index when pageValues does not list the RT', () => {
      const peakRow = [{ x: 300, y: 1 }];
      const hplcMsSt = {
        tic: {
          polarity: 'positive',
          currentPageValue: 0.5,
          positive: { data: { x: [0.3, 0.5, 0.7] } },
        },
        ms: {
          positive: {
            pageValues: null,
            peaks: [[], peakRow, []],
          },
        },
      };
      expect(getLcmsMzPageData(hplcMsSt)).toEqual(peakRow);
    });

    it('returns null when peaks slot is not an array', () => {
      const hplcMsSt = {
        tic: {
          polarity: 'positive',
          currentPageValue: 0.5,
          positive: { data: { x: [0.5] } },
        },
        ms: {
          positive: {
            pageValues: [0.5],
            peaks: [null],
          },
        },
      };
      expect(getLcmsMzPageData(hplcMsSt)).toBeNull();
    });
  });
});
