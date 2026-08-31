import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import ForecastViewer from '../../../components/forecast_viewer';

jest.mock('../../../components/d3_line/index', () => () => <div data-testid="viewer-line" />);
jest.mock('../../../components/forecast/nmr_viewer', () => () => <div />);
jest.mock('../../../components/forecast/ir_viewer', () => () => <div />);

const mockStore = configureStore([]);

const storeState = {
  ui: { viewer: 'SPECTRUM' },
  jcamp: { jcamps: [{ others: [] }] },
  wavelength: {},
  curve: { curveIdx: 0 },
};

const baseProps = {
  topic: {},
  feature: {},
  cLabel: '',
  xLabel: '',
  yLabel: '',
  isNmr: false,
  isIr: false,
  isUvvis: false,
  isXRD: false,
};

describe('ForecastViewer — does not re-dispatch FORECAST.INIT_STATUS on host-churned-but-equivalent forecast', () => {
  it('dispatches once on mount, not again for a fresh-but-content-equal forecast object', () => {
    const store = mockStore(storeState);
    store.dispatch = jest.fn(() => Promise.resolve({}));

    const forecastA = { molecule: { id: 1 }, predictions: { running: false } };
    const { rerender } = render(
      <Provider store={store}>
        <ForecastViewer {...baseProps} forecast={forecastA} />
      </Provider>,
    );
    const dispatchCountAfterMount = (store.dispatch as jest.Mock).mock.calls.length;
    expect(dispatchCountAfterMount).toBeGreaterThan(0);

    for (let i = 0; i < 5; i += 1) {
      const forecastEquivalent = { molecule: { id: 1 }, predictions: { running: false } };
      rerender(
        <Provider store={store}>
          <ForecastViewer {...baseProps} forecast={forecastEquivalent} />
        </Provider>,
      );
    }

    expect((store.dispatch as jest.Mock).mock.calls.length).toEqual(dispatchCountAfterMount);
  });

  it('still dispatches when the forecast predictions genuinely change', () => {
    const store = mockStore(storeState);
    store.dispatch = jest.fn(() => Promise.resolve({}));

    const forecastA = { molecule: { id: 1 }, predictions: { running: false } };
    const { rerender } = render(
      <Provider store={store}>
        <ForecastViewer {...baseProps} forecast={forecastA} />
      </Provider>,
    );
    const dispatchCountAfterMount = (store.dispatch as jest.Mock).mock.calls.length;

    const forecastB = { molecule: { id: 1 }, predictions: { running: true, refreshed: true } };
    rerender(
      <Provider store={store}>
        <ForecastViewer {...baseProps} forecast={forecastB} />
      </Provider>,
    );

    expect((store.dispatch as jest.Mock).mock.calls.length).toBeGreaterThan(dispatchCountAfterMount);
  });
});
