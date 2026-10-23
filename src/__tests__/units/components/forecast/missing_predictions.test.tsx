import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import NmrViewer from '../../../../components/forecast/nmr_viewer';
import IrViewer from '../../../../components/forecast/ir_viewer';
import ForecastViewer from '../../../../components/forecast_viewer';

jest.mock('../../../../components/d3_line/index', () => () => <div data-testid="viewer-line" />);

const mockStore = configureStore([]);

// FORECAST.INIT_STATUS stores the host's forecast as is, so the analysis viewers
// see whatever predictions the host has: none yet (`null`), an outline without
// output, or an output without results.
const incomplete = [
  ['no predictions', null],
  ['an outline without output', { outline: { code: 200 } }],
  ['an output without results', { outline: { code: 200 }, output: { result: [] } }],
];

describe('analysis viewers with incomplete predictions', () => {
  [['NmrViewer', NmrViewer], ['IrViewer', IrViewer]].forEach(([name, Viewer]: [string, any]) => {
    incomplete.forEach(([label, predictions]) => {
      it(`${name} renders with ${label}`, () => {
        const store = mockStore({ forecast: { predictions }, curve: { curveIdx: 0 } });
        render(
          <Provider store={store}>
            <Viewer molecule="" inputCb={false} />
          </Provider>,
        );
        expect(document.querySelector('.card-forecast-viewer')).toBeInTheDocument();
      });
    });
  });
});

describe('ForecastViewer without a loaded jcamp for the selected curve', () => {
  it('renders the spectrum with no comparisons', () => {
    const store = mockStore({
      ui: { viewer: 'SPECTRUM' },
      jcamp: { jcamps: [] },
      wavelength: {},
      curve: { curveIdx: 1 },
    });
    store.dispatch = () => ({});
    render(
      <Provider store={store}>
        <ForecastViewer
          topic={{}}
          feature={{}}
          cLabel=""
          xLabel=""
          yLabel=""
          forecast={{}}
          isNmr={false}
          isIr={false}
          isUvvis={false}
          isXRD={false}
        />
      </Provider>,
    );
    expect(screen.getByTestId('viewer-line')).toBeInTheDocument();
  });
});
