import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import LayerInit from '../../layer_init';
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

const baseStoreState = {
  layout: LIST_LAYOUT.LC_MS,
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

const renderLayer = (props: any, storeState = baseStoreState) => render(
  <Provider store={mockStore(storeState)}>
    <LayerInit {...baseProps} {...props} />
  </Provider>,
);

const ticEntity = {
  layout: LIST_LAYOUT.LC_MS,
  lcmsKind: 'tic',
  lcmsPolarity: 'positive',
  spectra: [{ pageValue: 1, data: [{ x: [1], y: [1] }] }],
};
const uvvisEntity = {
  layout: LIST_LAYOUT.LC_MS,
  lcmsKind: 'uvvis',
  spectra: [{ pageValue: 254, data: [{ x: [254], y: [0.5] }] }],
};
const mzEntity = {
  layout: LIST_LAYOUT.LC_MS,
  lcmsKind: 'mz',
  lcmsPolarity: 'positive',
  spectra: [{ pageValue: 1, data: [{ x: [100], y: [10] }] }],
};

describe('LayerInit routing — LCMS group detection', () => {
  it('routes to HPLCViewer when multiEntities form an LCMS group', () => {
    renderLayer({
      entity: ticEntity,
      multiEntities: [ticEntity, uvvisEntity, mzEntity],
    });

    expect(screen.getByTestId('hplc-viewer')).toBeInTheDocument();
    expect(screen.queryByTestId('multi-jcamps-viewer')).not.toBeInTheDocument();
    expect(screen.queryByTestId('layer-prism')).not.toBeInTheDocument();
  });

  it('routes to HPLCViewer for a lone LCMS entity (no multiEntities)', () => {
    renderLayer({
      entity: uvvisEntity,
      multiEntities: [],
    });

    expect(screen.getByTestId('hplc-viewer')).toBeInTheDocument();
  });

  it('routes to MultiJcampsViewer when multiEntities are mixed and not an LCMS group', () => {
    // Mixed-layout case: an entity reports LC_MS layout but the group does not
    // qualify as a real LCMS dataset (only one MZ, no TIC, no UVVIS),
    // so we must not misroute to HPLCViewer.
    const otherEntity = {
      layout: LIST_LAYOUT.IR,
      spectra: [{ pageValue: 0, data: [{ x: [1], y: [1] }] }],
    };
    renderLayer({
      entity: otherEntity,
      multiEntities: [otherEntity, mzEntity],
    }, { ...baseStoreState, layout: LIST_LAYOUT.IR });

    expect(screen.queryByTestId('hplc-viewer')).not.toBeInTheDocument();
    expect(screen.getByTestId('multi-jcamps-viewer')).toBeInTheDocument();
  });

  it('routes to LayerPrism for a single non-LCMS entity', () => {
    const irEntity = {
      layout: LIST_LAYOUT.IR,
      spectra: [{ xUnit: 'cm-1', yUnit: 'AU', data: [{ x: [1], y: [1] }] }],
    };
    renderLayer({
      entity: irEntity,
      multiEntities: [],
    }, { ...baseStoreState, layout: LIST_LAYOUT.IR });

    expect(screen.getByTestId('layer-prism')).toBeInTheDocument();
    expect(screen.queryByTestId('hplc-viewer')).not.toBeInTheDocument();
    expect(screen.queryByTestId('multi-jcamps-viewer')).not.toBeInTheDocument();
  });
});
