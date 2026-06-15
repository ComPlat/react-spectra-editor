import {
  normalizeLcMsMode,
  inferLcMsKind,
  inferLcMsCategory,
} from '../../../../../features/lc-ms/parsing/lcmsCategory';

describe('lc-ms/parsing lcmsCategory', () => {
  describe('normalizeLcMsMode', () => {
    it('maps vendor strings to NEGATIVE / POSITIVE / NEUTRAL', () => {
      expect(normalizeLcMsMode('Positive Mode')).toBe('POSITIVE');
      expect(normalizeLcMsMode('NEGATIV')).toBe('NEGATIVE');
      expect(normalizeLcMsMode('neutral scan')).toBe('NEUTRAL');
    });

    it('returns NEUTRAL for empty or unknown', () => {
      expect(normalizeLcMsMode('')).toBe('NEUTRAL');
      expect(normalizeLcMsMode(null)).toBe('NEUTRAL');
      expect(normalizeLcMsMode('unknown')).toBe('NEUTRAL');
    });
  });

  describe('inferLcMsKind', () => {
    it('detects TIC from MASS TIC or CHROMATOGRAM', () => {
      expect(inferLcMsKind({ dataType: 'MASS TIC' }, {})).toBe('TIC');
      expect(inferLcMsKind({}, { dataType: 'mass tic' })).toBe('TIC');
      expect(inferLcMsKind({}, { info: { TYPE: 'CHROMATOGRAM' } })).toBe('TIC');
    });

    it('detects MZ from MASS SPECTRUM', () => {
      expect(inferLcMsKind({ dataType: 'MASS SPECTRUM' }, {})).toBe('MZ');
    });

    it('uses time + intensity units as TIC', () => {
      expect(
        inferLcMsKind(
          { xUnit: 'Minutes', yUnit: 'Intensity' },
          {},
        ),
      ).toBe('TIC');
    });

    it('uses m/z axis as MZ', () => {
      expect(inferLcMsKind({ xUnit: 'm/z' }, {})).toBe('MZ');
    });

    it('defaults to SPECTRUM when nothing matches', () => {
      expect(inferLcMsKind({}, {})).toBe('SPECTRUM');
    });
  });

  describe('inferLcMsCategory', () => {
    it('returns existing csCategory when present', () => {
      expect(
        inferLcMsCategory(
          { csCategory: 'CUSTOM LABEL' },
          {},
        ),
      ).toBe('CUSTOM LABEL');
    });

    it('builds TIC / MZ + mode + SPECTRUM when not preset', () => {
      const jcamp = { info: { SCAN_MODE: 'Positive' } };
      const ticKind = { dataType: 'MASS TIC' };
      expect(inferLcMsCategory(ticKind, jcamp)).toBe('TIC POSITIVE SPECTRUM');

      const mzKind = { dataType: 'MASS SPECTRUM' };
      expect(inferLcMsCategory(mzKind, jcamp)).toBe('MZ POSITIVE SPECTRUM');
    });
  });
});
