import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import LayerInit from '../../layer_init';
import { MANAGER } from '../../constants/action_type';
import { LIST_LAYOUT } from '../../constants/list_layout';

jest.mock('../../components/hplc_viewer', () => () => (
  <div data-testid="hplc-viewer" />
));

jest.mock('../../components/multi_jcamps_viewer', () => () => (
  <div data-testid="multi-jcamps-viewer" />
));

jest.mock('../../layer_prism', () => () => (
  <div data-testid="layer-prism" />
));

const mockStore = configureStore([]);

const storeState = {
  layout: LIST_LAYOUT.H1,
  curve: { listCurves: [], curveIdx: 0 },
  hplcMs: {},
};

const baseProps = {
  others: { something: true },
  cLabel: '',
  xLabel: '',
  yLabel: '',
  molSvg: '',
  editorOnly: true,
  exactMass: '',
  forecast: {},
  operations: [],
  descriptions: [],
  canChangeDescription: false,
  onDescriptionChanged: () => {},
};

// A 1H entity as the host rebuilds it after a save: same spectrum and peaks,
// only `features.simulation` differs before and after "Refresh Simulation".
const buildNmrEntity = (nmrSimPeaks: string[]) => ({
  layout: LIST_LAYOUT.H1,
  spectra: [{ data: [{ x: [1, 2, 3], y: [4, 5, 6] }] }],
  features: {
    editPeak: { data: [{ x: [2], y: [5] }] },
    simulation: { nmrSimPeaks },
  },
});

const nmrResets = (store: ReturnType<typeof mockStore>) => store.getActions()
  .filter((a) => a.type === MANAGER.RESET_INIT_NMR);

describe('LayerInit — refreshed NMR simulation', () => {
  it('re-dispatches RESET_INIT_NMR with the new simulation when only the simulation changes', () => {
    const store = mockStore(storeState);
    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={buildNmrEntity([])} />
      </Provider>,
    );
    expect(nmrResets(store).length).toBe(1);

    rerender(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={buildNmrEntity(['1.20', '3.40'])} />
      </Provider>,
    );

    const resets = nmrResets(store);
    expect(resets.length).toBe(2);
    expect(resets[1].payload.simulation.nmrSimPeaks).toEqual(['1.20', '3.40']);
  });

  it('does not reset again for content-equivalent rebuilds of the same entity', () => {
    const store = mockStore(storeState);
    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={buildNmrEntity(['1.20'])} />
      </Provider>,
    );

    for (let i = 0; i < 5; i += 1) {
      rerender(
        <Provider store={store}>
          <LayerInit {...baseProps} entity={buildNmrEntity(['1.20'])} />
        </Provider>,
      );
    }

    expect(nmrResets(store).length).toBe(1);
  });
});
