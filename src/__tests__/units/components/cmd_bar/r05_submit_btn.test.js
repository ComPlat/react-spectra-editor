import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import BtnSubmit from '../../../../components/cmd_bar/r05_submit_btn';

jest.mock('../../../../helpers/extractPeaksEdit', () => ({
  extractPeaksEdit: jest.fn(() => [{ x: 1, y: 2 }]),
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
});
