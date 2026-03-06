import {
  classify,
  getLcMsInfo,
  isLcMsGroup,
  splitAndReindexEntities,
} from '../../../helpers/extractEntityLCMS';

describe('extractEntityLCMS helpers', () => {
  describe('getLcMsInfo', () => {
    it('prefers explicit lcms fields when present', () => {
      const entity = {
        lcmsKind: 'mz',
        lcmsPolarity: 'negative',
        csCategory: ['tic positive'],
      };

      expect(getLcMsInfo(entity)).toEqual({
        kind: 'mz',
        polarity: 'negative',
      });
    });

    it('detects tic positive from csCategory', () => {
      const entity = {
        csCategory: ['mass tic', 'positive mode'],
      };

      expect(getLcMsInfo(entity)).toEqual({
        kind: 'tic',
        polarity: 'positive',
      });
    });

    it('detects mz from dataType when categories are missing', () => {
      const entity = {
        dataType: 'Mass Spectrum',
      };

      expect(getLcMsInfo(entity)).toEqual({
        kind: 'mz',
        polarity: 'neutral',
      });
    });

    it('detects tic from units fallback', () => {
      const entity = {
        spectra: [
          {
            xUnit: 'Time',
            yUnit: 'Intensity',
          },
        ],
      };

      expect(getLcMsInfo(entity)).toEqual({
        kind: 'tic',
        polarity: 'neutral',
      });
    });

    it('returns unknown when no signal can classify entity', () => {
      expect(getLcMsInfo({})).toEqual({
        kind: 'unknown',
        polarity: 'neutral',
      });
    });
  });

  describe('classify', () => {
    it('returns unknown label for unknown entities', () => {
      expect(classify({})).toEqual('unknown');
    });

    it('returns composite label for known entities', () => {
      expect(classify({ csCategory: ['uvvis', 'positive'] })).toEqual('uvvis_positive');
    });
  });

  describe('splitAndReindexEntities', () => {
    it('splits by kind, sorts by polarity and sets curveIdx', () => {
      const ticNegative: any = { csCategory: ['tic', 'negative'] };
      const ticPositive: any = { csCategory: ['tic', 'positive'] };
      const mzNeutral = { csCategory: ['mz'] };
      const uvvis = { csCategory: ['uvvis'] };
      const unknown = {};

      const result = splitAndReindexEntities([
        ticNegative,
        ticPositive,
        mzNeutral,
        uvvis,
        unknown,
      ]);

      expect(result.ticEntities).toHaveLength(2);
      expect(result.ticEntities[0]).not.toBe(ticPositive);
      expect(result.ticEntities[1]).not.toBe(ticNegative);
      expect(result.ticEntities[0]).toMatchObject({ csCategory: ['tic', 'positive'] });
      expect(result.ticEntities[1]).toMatchObject({ csCategory: ['tic', 'negative'] });
      expect(result.ticEntities[0].curveIdx).toEqual(0);
      expect(result.ticEntities[1].curveIdx).toEqual(1);

      expect(result.mzEntities).toHaveLength(1);
      expect(result.mzEntities[0]).not.toBe(mzNeutral);
      expect(result.mzEntities[0]).toMatchObject({ csCategory: ['mz'] });
      expect(result.mzEntities[0].curveIdx).toEqual(0);

      expect(result.uvvisEntities).toEqual([
        expect.objectContaining({ csCategory: ['uvvis'] }),
      ]);
      expect(result.unknownEntities).toEqual([
        expect.objectContaining({}),
      ]);
      expect(result.dataEntities[0]).toMatchObject({ csCategory: ['mz'] });
      expect(result.allEntities).toHaveLength(5);
      expect(result.ticEntities[0].lcmsKind).toEqual('tic');
      expect(result.ticEntities[0].lcmsPolarity).toEqual('positive');
      expect(ticPositive.lcmsKind).toBeUndefined();
      expect(ticPositive.lcmsPolarity).toBeUndefined();
    });
  });

  describe('isLcMsGroup', () => {
    it('returns false on empty input', () => {
      expect(isLcMsGroup([])).toEqual(false);
      expect(isLcMsGroup(null as any)).toEqual(false);
    });

    it('returns true when uvvis + tic is present', () => {
      const entities = [
        { csCategory: ['uvvis'] },
        { csCategory: ['tic', 'positive'] },
      ];

      expect(isLcMsGroup(entities)).toEqual(true);
    });

    it('returns true when uvvis + mz is present', () => {
      const entities = [
        { csCategory: ['uvvis'] },
        { csCategory: ['mz', 'negative'] },
      ];

      expect(isLcMsGroup(entities)).toEqual(true);
    });

    it('returns false when uvvis exists alone', () => {
      expect(isLcMsGroup([{ csCategory: ['uvvis'] }])).toEqual(false);
    });
  });
});
