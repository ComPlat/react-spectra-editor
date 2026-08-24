import {
  isChemstationLcms,
  parseChemstationPages,
} from '../../../../../features/lc-ms/parsing/chemstation';

// A plain chem-spectra MS NTUPLES export: the time axis is a third INDEPENDENT
// variable and there is no PAGE. Shaped after src/__tests__/fixtures/ms_jcamp.js.
const msJcamp = (info = {}) => ({
  info: {
    DATATYPE: 'MASS SPECTRUM',
    VARTYPE: 'INDEPENDENT, DEPENDENT, INDEPENDENT',
    SYMBOL: 'X, Y, T',
    UNITS: 'M/Z, RELATIVE ABUNDANCE, SECONDS',
    ...info,
  },
  spectra: [
    { dataType: 'MASS SPECTRUM', page: 'T= 272', pageValue: 272 },
    { dataType: 'MASS SPECTRUM', page: 'T= 301', pageValue: 301 },
  ],
});

// A Chemstation LC/MS m/z export: scans are indexed by a retention-time PAGE
// variable. Shaped after src/__tests__/fixtures/lc_ms_jcamp_mz_chemstation.js.
const chemstationJcamp = (info = {}, spectra = null) => ({
  info: {
    DATATYPE: 'MASS SPECTRUM',
    VARTYPE: 'PAGE, X, Y',
    SYMBOL: 'T, X, Y',
    UNITS: ', m/z, Intensity',
    XUNITS: 'm/z',
    YUNITS: 'Intensity',
    ...info,
  },
  spectra: spectra || [
    { dataType: 'MASS SPECTRUM', page: 'T= 1.122', pageValue: 1.122 },
    { dataType: 'MASS SPECTRUM', page: 'T= 1.138', pageValue: 1.138 },
  ],
});

const SRC = '##TITLE=Spectrum\n##DATA TYPE=MASS SPECTRUM\n';

describe('lc-ms/parsing chemstation', () => {
  describe('isChemstationLcms guards', () => {
    it('returns false when the source is not a string', () => {
      expect(isChemstationLcms(null, chemstationJcamp())).toBe(false);
      expect(isChemstationLcms(undefined, chemstationJcamp())).toBe(false);
    });
  });

  describe('self-declared LC/MS content', () => {
    it('accepts an LC/MS or MASS TIC root data type', () => {
      expect(isChemstationLcms(SRC, { info: { DATATYPE: 'LC/MS' }, spectra: [] })).toBe(true);
      expect(isChemstationLcms(SRC, { info: { DATATYPE: 'MASS TIC' }, spectra: [] })).toBe(true);
    });

    it('accepts an array-valued data type, as a repeated ##DATA TYPE produces', () => {
      const jcamp = { info: { DATATYPE: ['LC/MS', 'LC/MS'] }, spectra: [] };
      expect(isChemstationLcms(SRC, jcamp)).toBe(true);
    });

    it('accepts a TIC block without needing any other hint', () => {
      // Regression for the `|| spectra.length > 0` tautology: some() already
      // implies a non-empty array, so that term made the branch unconditional.
      const jcamp = { info: {}, spectra: [{ dataType: 'MASS TIC' }] };
      expect(isChemstationLcms(SRC, jcamp)).toBe(true);
    });

    it('does not read STATIC / KINETIC as TIC', () => {
      expect(isChemstationLcms(SRC, { info: {}, spectra: [{ dataType: 'STATIC SPECTRUM' }] })).toBe(false);
      expect(isChemstationLcms(SRC, msJcamp({ $CSCATEGORY: 'KINETIC' }))).toBe(false);
      expect(isChemstationLcms(SRC, msJcamp({ $CSCATEGORY: 'OPTIC' }))).toBe(false);
    });
  });

  describe('structural discrimination by PAGE axis', () => {
    it('keeps a plain MS NTUPLES export out of the LC/MS layout', () => {
      expect(isChemstationLcms(SRC, msJcamp())).toBe(false);
    });

    it('accepts a Chemstation m/z export', () => {
      expect(isChemstationLcms(SRC, chemstationJcamp())).toBe(true);
    });

    it('accepts a single-scan Chemstation export', () => {
      // The classifier runs before the ntuples->spectra expansion in
      // ExtractJcamp, so a genuine single-scan export arrives with one
      // spectrum. Classification must not depend on the spectrum count.
      const single = [{ dataType: 'MASS SPECTRUM', page: 'T= 1.122', pageValue: 1.122 }];
      expect(isChemstationLcms(SRC, chemstationJcamp({}, single))).toBe(true);
    });

    it('requires more than a PAGE axis, so 2D NMR is not swept in', () => {
      const nmr = {
        info: { DATATYPE: 'NMR SPECTRUM', VARTYPE: 'PAGE, X, Y' },
        spectra: [{ dataType: 'NMR SPECTRUM' }],
      };
      expect(isChemstationLcms(SRC, nmr)).toBe(false);
    });

    it('treats an ##NTUPLES_PAGE_HEADER record as a page axis', () => {
      const source = `${SRC}##NTUPLES_PAGE_HEADER= T\n`;
      const jcamp = {
        info: { DATATYPE: 'MASS SPECTRUM' },
        spectra: [{ dataType: 'MASS SPECTRUM' }],
      };
      expect(isChemstationLcms(source, jcamp)).toBe(true);
    });
  });

  describe('units vocabulary does not decide the layout', () => {
    // Each variant is a plain MS export whose units line differs only in
    // spacing or wording. A classifier keyed on a units literal accepts them
    // all as LC/MS; a structural one does not.
    const variants = [
      'M/Z , RELATIVE ABUNDANCE , SECONDS',
      'M/Z, RELATIVE  ABUNDANCE, SECONDS',
      'M/Z, RELATIVE ABUNDANCE, MINUTES',
      'MASS, INTENSITY, SECONDS',
      'm/z, relative abundance, seconds',
    ];

    variants.forEach((units) => {
      it(`keeps the MS layout for ##UNITS= ${units}`, () => {
        const source = `${SRC}##UNITS= ${units}\n`;
        expect(isChemstationLcms(source, msJcamp({ UNITS: units }))).toBe(false);
      });
    });

    it('is not vetoed by the MS units line appearing in a comment', () => {
      const source = `${SRC}$$ ##UNITS= M/Z, RELATIVE ABUNDANCE, SECONDS\n`;
      expect(isChemstationLcms(source, chemstationJcamp())).toBe(true);
    });
  });

  describe('$CSCATEGORY cannot promote a plain MS export', () => {
    const categories = [
      'POSITIVE', 'NEGATIVE', 'NEUTRAL', 'STATIC', 'KINETIC', 'OPTIC', 'SPECTRUM',
    ];

    categories.forEach((category) => {
      it(`keeps the MS layout for a scalar $CSCATEGORY of ${category}`, () => {
        expect(isChemstationLcms(SRC, msJcamp({ $CSCATEGORY: category }))).toBe(false);
      });
    });

    it('keeps the MS layout for array-valued categories too', () => {
      expect(isChemstationLcms(SRC, msJcamp({ $CSCATEGORY: ['POSITIVE'] }))).toBe(false);
      expect(isChemstationLcms(SRC, msJcamp({ $CSCATEGORY: ['SPECTRUM', 'EDIT_PEAK'] }))).toBe(false);
    });

    it('still reads a TIC or UVVIS category on a page-indexed file', () => {
      expect(isChemstationLcms(SRC, chemstationJcamp({ $CSCATEGORY: 'TIC POSITIVE' }))).toBe(true);
      expect(isChemstationLcms(SRC, chemstationJcamp({ $CSCATEGORY: ['UVVIS PEAK TABLE'] }))).toBe(true);
    });
  });

  describe('vendor fallback for exports without a page axis', () => {
    // Retained deliberately: Chemstation exports that predate the page-indexed
    // layout are identified by vendor metadata alone.
    it('accepts a MASS SPECTRUM root carrying OpenLab or a scan mode', () => {
      expect(isChemstationLcms(SRC, msJcamp({ SOFTWARE: 'openlab' }))).toBe(true);
      expect(isChemstationLcms(SRC, msJcamp({ SCANMODE: 'positiv' }))).toBe(true);
    });

    it('does not accept a MASS SPECTRUM block or ##TYPE= MS SPECTRUM on its own', () => {
      // These are exactly what a plain MS export carries, which is why they
      // are not evidence of chromatography.
      expect(isChemstationLcms(SRC, msJcamp())).toBe(false);
      expect(isChemstationLcms(SRC, msJcamp({ TYPE: 'ms spectrum' }))).toBe(false);
    });
  });
});

describe('lc-ms/parsing parseChemstationPages', () => {
  it('returns an empty list when there are no pages', () => {
    expect(parseChemstationPages(null, {})).toEqual([]);
    expect(parseChemstationPages('##TITLE=x\n', {})).toEqual([]);
  });

  it('splits a multi-page source into one spectrum per page', () => {
    const source = [
      '##TITLE=Spectrum',
      '##PAGE=T= 1.5',
      '##XYDATA=(XY..XY)',
      '100.0, 5.0',
      '##PAGE=T= 2.5',
      '##XYDATA=(XY..XY)',
      '200.0, 6.0',
      '',
    ].join('\n');
    const pages = parseChemstationPages(source, { info: {}, spectra: [] });
    expect(pages).toHaveLength(2);
    expect(pages.map((p) => p.pageValue)).toEqual([1.5, 2.5]);
  });
});
