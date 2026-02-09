import {
  selectWavelength,
  changeTic,
  updateCurrentPageValue,
  clearIntegrationAllHplcMs,
  clearAllPeaksHplcMs,
} from "../../../actions/hplc_ms";
import { HPLC_MS } from "../../../constants/action_type";
import { ExtractJcamp } from "../../../helpers/chem";
import { LIST_LAYOUT } from "../../../constants/list_layout";
import { getLcMsInfo, splitAndReindexEntities } from "../../../helpers/extractEntityLCMS";
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
