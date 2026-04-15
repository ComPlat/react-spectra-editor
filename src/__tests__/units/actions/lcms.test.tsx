import {
  selectWavelength,
  changeTic,
  updateCurrentPageValue,
  clearIntegrationAllHplcMs,
  clearAllPeaksHplcMs,
} from "../../../actions/hplc_ms";
import { clickUiTarget } from "../../../actions/ui";
import { HPLC_MS } from "../../../constants/action_type";
import { ExtractJcamp, buildLcmsMsPageJcamp } from "../../../helpers/chem";
import { LIST_LAYOUT } from "../../../constants/list_layout";
import { getLcMsInfo, splitAndReindexEntities } from "../../../helpers/extractEntityLCMS";
import { shouldDisplayLcmsSubViewerAt } from "../../../sagas/saga_ui";
import hplcMsTicPosJcamp from "../../fixtures/lc_ms_jcamp_tic_pos";
import hplcMsTicNegJcamp from "../../fixtures/lc_ms_jcamp_tic_neg";
import hplcMsUvvisJcamp from "../../fixtures/lc_ms_jcamp_uvvis";
import lcMsMzChemstationJcamp from "../../fixtures/lc_ms_jcamp_mz_chemstation";

const hasSpectrumData = (entity: any) => {
  const data = entity?.spectra?.[0]?.data?.[0];
  return Array.isArray(data?.x) && data.x.length > 0
    && Array.isArray(data?.y) && data.y.length > 0;
};

const extractPages = (entity: any) => {
  const rawPages = (entity?.spectra || []).map((sp: any) => sp.pageValue ?? sp.page);
  const parsed = rawPages
    .map((value: any) => parseFloat(String(value).match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/)?.[0] || ''))
    .filter((value: number) => Number.isFinite(value));
  return parsed;
};

const buildMzEntity = (polarity: 'positive' | 'negative' | 'neutral', pageValues: number[]) => ({
  layout: LIST_LAYOUT.LC_MS,
  lcmsKind: 'mz',
  lcmsPolarity: polarity,
  title: `ms-${polarity}`,
  spectra: pageValues.map((pageValue) => ({
    pageValue,
    page: String(pageValue),
    pageSymbol: String(pageValue),
    xUnit: 'm/z',
    yUnit: 'Intensity',
    data: [{ x: [100, 101, 102], y: [10, 15, 8] }],
  })),
});

describe('LCMS actions', () => {
  it('selectWavelength returns correct action', () => {
    const payload = { target: { value: 254 } };
    const action = selectWavelength(payload);
    expect(action.type).toEqual(HPLC_MS.UPDATE_UVVIS_WAVE_LENGTH);
    expect(action.payload).toEqual(payload);
  });

  it('changeTic maps numeric values to polarity', () => {
    expect(changeTic({ target: { value: 0 } }).payload.polarity).toEqual('positive');
    expect(changeTic({ target: { value: 1 } }).payload.polarity).toEqual('negative');
    expect(changeTic({ target: { value: 2 } }).payload.polarity).toEqual('neutral');
  });

  it('changeTic keeps explicit polarity', () => {
    expect(changeTic({ polarity: 'negative' }).payload.polarity).toEqual('negative');
    expect(changeTic({ polarity: 'positive' }).payload.polarity).toEqual('positive');
  });

  it('updateCurrentPageValue returns correct action', () => {
    const action = updateCurrentPageValue(1.234);
    expect(action.type).toEqual(HPLC_MS.UPDATE_CURRENT_PAGE_VALUE);
    expect(action.payload).toEqual({ currentPageValue: 1.234 });
  });

  it('clearIntegrationAllHplcMs returns correct action', () => {
    const action = clearIntegrationAllHplcMs({ source: 'test' });
    expect(action.type).toEqual(HPLC_MS.CLEAR_INTEGRATION_ALL_HPLCMS);
    expect(action.payload).toEqual({ source: 'test' });
  });

  it('clearAllPeaksHplcMs returns correct action', () => {
    const action = clearAllPeaksHplcMs({ source: 'test' });
    expect(action.type).toEqual(HPLC_MS.CLEAR_ALL_PEAKS_HPLCMS);
    expect(action.payload).toEqual({ source: 'test' });
  });

  it('clickUiTarget keeps the LCMS TIC source hint', () => {
    const action = clickUiTarget(
      { x: 1.234, y: 42 },
      true,
      0,
      1,
      false,
      'lcms_tic',
    );
    expect(action.payload).toEqual({ x: 1.234, y: 42 });
    expect(action.sourceHint).toEqual('lcms_tic');
    expect(action.jcampIdx).toEqual(1);
  });

  it('opens the LCMS subviewer from TIC clicks in zoom mode', () => {
    expect(shouldDisplayLcmsSubViewerAt({
      isLcmsLayout: true,
      payload: { x: 1.234, y: 42 },
      sourceHint: 'lcms_tic',
      uiSweepType: 'zoom in',
    })).toEqual(true);

    expect(shouldDisplayLcmsSubViewerAt({
      isLcmsLayout: true,
      payload: { x: 1.234, y: 42 },
      sourceHint: 'lcms_tic',
      uiSweepType: 'peak add',
    })).toEqual(false);

    expect(shouldDisplayLcmsSubViewerAt({
      isLcmsLayout: true,
      payload: { x: 1.234, y: 42 },
      sourceHint: null,
      uiSweepType: 'zoom in',
    })).toEqual(false);
  });
});

describe('LCMS ExtractJcamp', () => {
  it('Extract TIC (positive) with data and layout', () => {
    const entity = ExtractJcamp(hplcMsTicPosJcamp);
    expect(entity.layout).toEqual(LIST_LAYOUT.LC_MS);
    expect(hasSpectrumData(entity)).toEqual(true);
    expect(getLcMsInfo(entity).kind).toEqual('tic');
  });

  it('Extract TIC (negative) with data and layout', () => {
    const entity = ExtractJcamp(hplcMsTicNegJcamp);
    expect(entity.layout).toEqual(LIST_LAYOUT.LC_MS);
    expect(hasSpectrumData(entity)).toEqual(true);
    expect(getLcMsInfo(entity).kind).toEqual('tic');
  });

  it('Extract UVVIS with data and layout', () => {
    const entity: any = ExtractJcamp(hplcMsUvvisJcamp);
    expect(entity.layout).toEqual(LIST_LAYOUT.LC_MS);
    expect(Array.isArray(entity.features)).toEqual(true);
    expect(entity.features.length).toBeGreaterThan(0);
    expect(hasSpectrumData(entity)).toEqual(true);
    expect(getLcMsInfo(entity).kind).toEqual('uvvis');
  });

  it('Extract UVVIS reads ##$CSLCMSMZPAGE from first CHEMSPECTRA UVVIS peak table block', () => {
    const injected = hplcMsUvvisJcamp.replace(
      '$$ === CHEMSPECTRA UVVIS PEAK TABLE ===\n',
      '$$ === CHEMSPECTRA UVVIS PEAK TABLE ===\n##$CSLCMSMZPAGE=1.234\n',
    );
    const entity: any = ExtractJcamp(injected);
    expect(entity.lcms_mz_page).toBeCloseTo(1.234);
  });

  it('Extract UVVIS ignores empty ##$CSLCMSMZPAGE (fallback: no lcms_mz_page key)', () => {
    const injected = hplcMsUvvisJcamp.replace(
      '$$ === CHEMSPECTRA UVVIS PEAK TABLE ===\n',
      '$$ === CHEMSPECTRA UVVIS PEAK TABLE ===\n##$CSLCMSMZPAGE=\n',
    );
    const entity: any = ExtractJcamp(injected);
    expect(entity.lcms_mz_page).toBeUndefined();
  });

  it('Extract Chemstation MZ with multiple pages', () => {
    const entity: any = ExtractJcamp(lcMsMzChemstationJcamp);
    expect(entity.layout).toEqual(LIST_LAYOUT.LC_MS);
    expect(Array.isArray(entity.features)).toEqual(true);
    expect(entity.features.length).toBeGreaterThan(0);
    const pages = extractPages(entity);
    expect(new Set(pages).size).toBeGreaterThan(1);
  });
});

describe('LCMS grouping', () => {
  it('Split entities into TIC/UVVIS/MZ groups', () => {
    const entities = [
      ExtractJcamp(hplcMsTicPosJcamp),
      ExtractJcamp(hplcMsTicNegJcamp),
      ExtractJcamp(hplcMsUvvisJcamp),
      ExtractJcamp(lcMsMzChemstationJcamp),
    ];
    const { ticEntities, uvvisEntities, mzEntities } = splitAndReindexEntities(entities);
    expect(ticEntities.length).toBeGreaterThanOrEqual(2);
    expect(uvvisEntities.length).toBeGreaterThanOrEqual(1);
    expect(mzEntities.length).toBeGreaterThanOrEqual(1);
  });
});

describe('LCMS MS page on request', () => {
  let infoSpy: jest.SpyInstance;

  beforeEach(() => {
    infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    infoSpy.mockRestore();
  });

  it('chooses the MS source from requested polarity and returns a single-page JCAMP', () => {
    const positiveEntity = buildMzEntity('positive', [1.16165161, 2.5]);
    const negativeEntity = buildMzEntity('negative', [1.16165161]);

    const result = buildLcmsMsPageJcamp(
      [positiveEntity, negativeEntity],
      { retentionTime: '1.16165161', polarity: 'positive' },
    );

    expect(result.selection.msSourceChosen?.polarity).toEqual('positive');
    expect(result.selection.pageChosen?.selected).toEqual('1.16165161');
    expect(result.selection.fallbackApplied).toEqual(false);
    expect(result.jcamp).toContain('##PAGE=1.16165161');
    expect(result.jcamp.match(/##PAGE=/g)).toHaveLength(1);
    expect(result.jcamp).not.toContain('##PAGE=2.5');
    expect(infoSpy).toHaveBeenCalledWith(
      '[Chemspectra][LCMS_MS_PAGE_REQUEST]',
      expect.objectContaining({
        retentionTime: '1.16165161',
        polarity: 'positive',
        hasPageHeader: true,
        fallbackApplied: false,
      }),
    );
  });

  it('uses the only MS source even when polarity is not discriminant', () => {
    const onlyMsEntity = buildMzEntity('neutral', [1.16165161, 1.8]);

    const result = buildLcmsMsPageJcamp(
      [onlyMsEntity],
      { retentionTime: '1.16165161', polarity: 'negative' },
    );

    expect(result.selection.msSourceChosen?.polarity).toEqual('neutral');
    expect(result.selection.fallbackApplied).toEqual(true);
    expect(result.jcamp).toContain('##PAGE=1.16165161');
    expect(result.jcamp.match(/##PAGE=/g)).toHaveLength(1);
  });
});
