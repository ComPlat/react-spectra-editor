import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import BtnSubmit, { computeCvYScaleFactor } from '../../../../components/cmd_bar/r05_submit_btn';
import Format from '../../../../helpers/format';

jest.mock('../../../../helpers/extractPeaksEdit', () => ({
  extractPeaksEdit: () => [{ x: 1, y: 2 }],
  formatLcmsPeaksForBackend: () => [{ peakMock: true }],
  formatLcmsIntegralsForBackend: () => [{ integralMock: true }],
  getLcmsMzPageData: () => ({ mzPageDataMock: true }),
}));

const mockStore = configureStore([]);

const buildBaseState = (overrides = {}) => ({
  editPeak: { present: { selectedIdx: 0, peaks: [{ pos: [], neg: [] }] } },
  threshold: { list: [{ isEdit: true, value: 10, upper: false, lower: false }] },
  layout: '1H',
  shift: { shifts: [] },
  scan: { target: 5, isAuto: false },
  forecast: { predictions: {} },
  submit: { decimal: 2 },
  integration: { present: { integrations: [{ stack: [], refArea: 1, refFactor: 1 }] } },
  multiplicity: { present: { multiplicities: [{ stack: [], shift: 0 }] } },
  wavelength: {},
  cyclicvolta: { useCurrentDensity: false, areaUnit: 'cm²', areaValue: 1.0 },
  curve: { curveIdx: 0, listCurves: [] },
  axesUnits: { axes: [{ xUnit: '', yUnit: '' }] },
  detector: {},
  meta: { dscMetaData: {} },
  hplcMs: {},
  ...overrides,
});

const renderBtnSubmit = (state, operationValue) => {
  const store = mockStore(state);
  const feature = { xUnit: 'ppm', yUnit: 'intensity', scanAutoTarget: 1, thresRef: 3 };
  const view = render(
    <Provider store={store}>
      <BtnSubmit
        operation={{ name: 'save', value: operationValue }}
        feature={feature}
        isAscend
        isIntensity
      />
    </Provider>,
  );
  const button = view.container.querySelector('.btn-sv-bar-submit');
  fireEvent.click(button);
  return view;
};

describe('<BtnSubmit payload contract />', () => {
  it('sends a spectra_list with length 1 in single-spectrum mode', () => {
    const operationValue = jest.fn();
    const state = buildBaseState({
      curve: { curveIdx: 0, listCurves: [] },
    });

    renderBtnSubmit(state, operationValue);

    expect(operationValue).toHaveBeenCalledTimes(1);
    const payload = operationValue.mock.calls[0][0];
    expect(Array.isArray(payload.spectra_list)).toBe(true);
    expect(payload.spectra_list).toHaveLength(1);
    expect(payload).toHaveProperty('curveSt');
    expect(payload.curveSt).toEqual({ curveIdx: 0 });
  });

  it('sends a spectra_list with length N in multi-spectrum mode', () => {
    const operationValue = jest.fn();
    const state = buildBaseState({
      curve: {
        curveIdx: 1,
        listCurves: [
          { feature: { xUnit: 'ppm', yUnit: 'intensity', scanAutoTarget: 1, thresRef: 3 } },
          { feature: { xUnit: 'ppm', yUnit: 'intensity', scanAutoTarget: 2, thresRef: 4 } },
          { feature: { xUnit: 'ppm', yUnit: 'intensity', scanAutoTarget: 3, thresRef: 5 } },
        ],
      },
      threshold: { list: [{ value: 10 }, { value: 20 }, { value: 30 }] },
      axesUnits: { axes: [{ xUnit: '', yUnit: '' }, { xUnit: '', yUnit: '' }, { xUnit: '', yUnit: '' }] },
    });

    renderBtnSubmit(state, operationValue);

    const payload = operationValue.mock.calls[0][0];
    expect(payload.spectra_list).toHaveLength(3);
    expect(payload.curveSt).toEqual({ curveIdx: 1 });
  });

  it('controls presence/absence of keepPred and simulatenmr', () => {
    const withFlagsCb = jest.fn();
    const noFlagsCb = jest.fn();

    const withFlagsState = buildBaseState({
      forecast: { predictions: { keepPred: true, simulatenmr: false } },
    });
    renderBtnSubmit(withFlagsState, withFlagsCb);
    const withFlagsPayload = withFlagsCb.mock.calls[0][0];
    expect(withFlagsPayload.spectra_list[0]).toMatchObject({
      keepPred: true,
      simulatenmr: false,
    });

    const noFlagsState = buildBaseState({
      forecast: { predictions: { keepPred: 'yes' } },
    });
    renderBtnSubmit(noFlagsState, noFlagsCb);
    const noFlagsPayload = noFlagsCb.mock.calls[0][0];
    expect(noFlagsPayload.spectra_list[0]).not.toHaveProperty('keepPred');
    expect(noFlagsPayload.spectra_list[0]).not.toHaveProperty('simulatenmr');
  });

  describe('layout LC/MS', () => {
    const uvvisFeature = { xUnit: 'min', yUnit: 'mAU', scanAutoTarget: 1, thresRef: 3 };
    let formatedLcmsSpy;

    beforeEach(() => {
      formatedLcmsSpy = jest.spyOn(Format, 'formatedLCMS').mockReturnValue('lcms_head_text');
    });

    afterEach(() => {
      formatedLcmsSpy.mockRestore();
    });

    it('replicates lcms_* onto each UVVIS entry in spectra_list', () => {
      const operationValue = jest.fn();
      const state = buildBaseState({
        layout: 'LC/MS',
        curve: {
          curveIdx: 0,
          listCurves: [
            { lcmsKind: 'uvvis', feature: { ...uvvisFeature, scanAutoTarget: 1 } },
            { lcmsKind: 'uvvis', feature: { ...uvvisFeature, scanAutoTarget: 2 } },
          ],
        },
        hplcMs: {
          uvvis: { selectedWaveLength: 220 },
          tic: { currentPageValue: 1.25 },
        },
      });

      renderBtnSubmit(state, operationValue);

      const payload = operationValue.mock.calls[0][0];
      expect(payload.spectra_list).toHaveLength(2);
      payload.spectra_list.forEach((entry) => {
        expect(entry.lcms_peaks).toEqual([{ peakMock: true }]);
        expect(entry.lcms_integrals).toEqual([{ integralMock: true }]);
        expect(entry.lcms_integrations_export).toBe('percent');
        expect(entry.lcms_peaks_text).toBe('lcms_head_text');
        expect(entry.lcms_uvvis_wavelength).toBe(220);
        expect(entry.lcms_mz_page).toBe(1.25);
        expect(entry.lcms_mz_page_data).toEqual({ mzPageDataMock: true });
      });
      expect(payload.lcms_peaks).toEqual([{ peakMock: true }]);
      expect(formatedLcmsSpy).toHaveBeenCalled();
    });

    it('with no UVVIS in listCurves (fallback to feature), no lcms_* on the spectrum item', () => {
      const operationValue = jest.fn();
      const state = buildBaseState({
        layout: 'LC/MS',
        curve: {
          curveIdx: 0,
          listCurves: [{ lcmsKind: 'tic', feature: uvvisFeature }],
        },
        hplcMs: {
          uvvis: { selectedWaveLength: 210 },
          tic: { currentPageValue: 0.5 },
        },
      });

      renderBtnSubmit(state, operationValue);

      const payload = operationValue.mock.calls[0][0];
      expect(payload.spectra_list).toHaveLength(1);
      const entry = payload.spectra_list[0];
      expect(entry).not.toHaveProperty('lcms_peaks');
      expect(entry).not.toHaveProperty('lcms_integrals');
      expect(entry).not.toHaveProperty('lcms_peaks_text');
      expect(payload.lcms_peaks).toEqual([{ peakMock: true }]);
    });
  });

  // Regression for review finding RR-1 (B5 remainder): the CV current-density factor
  // used on submit/export must match the chart (multi_focus.computeYTransformFactor)
  // and panel — i.e. one conversion to A/cm², not a double /100 for mm².
  describe('computeCvYScaleFactor — CV current-density factor (RR-1 / B5)', () => {
    const feature = { yUnit: 'A' };

    it('returns 1.0 when current density is off', () => {
      expect(computeCvYScaleFactor(feature, { useCurrentDensity: false })).toEqual(1.0);
    });

    it('treats 100 mm² the same as 1 cm² (no double /100)', () => {
      const fMm2 = computeCvYScaleFactor(feature, {
        useCurrentDensity: true, areaValue: 100, areaUnit: 'mm²',
      });
      const fCm2 = computeCvYScaleFactor(feature, {
        useCurrentDensity: true, areaValue: 1, areaUnit: 'cm²',
      });
      expect(fMm2).toBeCloseTo(fCm2);
      expect(fMm2).toBeCloseTo(1.0); // pre-fix this was 0.01 (100x too small)
    });

    it('gives A/cm² for a mm² area (factor = 100 / area_mm²)', () => {
      // 50 mm² == 0.5 cm² → factor 1/0.5 = 2
      expect(computeCvYScaleFactor(feature, {
        useCurrentDensity: true, areaValue: 50, areaUnit: 'mm²',
      })).toBeCloseTo(2.0);
    });

    it('scales by 1000 for mA while keeping the area conversion', () => {
      expect(computeCvYScaleFactor({ yUnit: 'mA' }, {
        useCurrentDensity: true, areaValue: 100, areaUnit: 'mm²',
      })).toBeCloseTo(1000.0);
    });
  });
});
