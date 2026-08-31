import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import LayerPrism from '../../layer_prism';
import { LIST_LAYOUT } from '../../constants/list_layout';
import { LIST_UI_VIEWER_TYPE } from '../../constants/list_ui';

// Capture whatever `feature`/`topic` LayerPrism actually hands down, without
// exercising the real D3/panel rendering machinery.
const captured: any[] = [];
jest.mock('../../layer_content', () => (props: any) => {
  captured.push({ topic: props.topic, feature: props.feature });
  return <div data-testid="layer-content" />;
});
jest.mock('../../components/cmd_bar/index', () => () => <div />);
jest.mock('../../components/panel/index', () => () => <div />);

const mockStore = configureStore([]);

const storeState = {
  scan: {},
  threshold: { list: [{ isEdit: true, value: false, upper: false, lower: false }] },
  ui: { viewer: LIST_UI_VIEWER_TYPE.SPECTRUM },
  curve: { curveIdx: 0 },
  integration: { present: { integrations: [] } },
};

const baseProps = {
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
};

// Two genuinely different IR-layout entities sharing an IDENTICAL x grid
// (as any instrument that resamples every measurement onto the same
// standardized wavenumber axis would produce) but different y (measured)
// data - the exact class of collision an x-only, first-spectrum-only
// signature cannot distinguish (see issue #329's blank-chart regression).
const buildEntity = (yValues: number[]) => ({
  layout: LIST_LAYOUT.IR,
  title: '',
  spectra: [{ data: [{ x: [4000, 3000, 2000], y: yValues }] }],
  features: {
    autoPeak: {
      data: [{ x: [4000, 3000, 2000], y: yValues }],
      maxY: Math.max(...yValues),
    },
  },
});

describe('LayerPrism does not serve stale cached data for a different entity with the same x grid (issue #329)', () => {
  beforeEach(() => {
    captured.length = 0;
  });

  it('renders the second entity own data, not the first entity cached feature/topic', () => {
    const store = mockStore(storeState);
    const entityA = buildEntity([1, 2, 3]);
    const entityB = buildEntity([100, 200, 300]);

    const { rerender } = render(
      <Provider store={store}>
        <LayerPrism {...baseProps} entity={entityA} />
      </Provider>,
    );
    expect(captured[captured.length - 1].topic.y).toEqual([1, 2, 3]);

    rerender(
      <Provider store={store}>
        <LayerPrism {...baseProps} entity={entityB} />
      </Provider>,
    );

    expect(captured[captured.length - 1].topic.y).toEqual([100, 200, 300]);
    expect(captured[captured.length - 1].feature.data[0].y).toEqual([100, 200, 300]);
  });

  it('still reuses the cached result for a re-render with a fresh-but-content-equal entity', () => {
    const store = mockStore(storeState);
    const entityA1 = buildEntity([1, 2, 3]);
    const entityA2 = buildEntity([1, 2, 3]);

    const { rerender } = render(
      <Provider store={store}>
        <LayerPrism {...baseProps} entity={entityA1} />
      </Provider>,
    );
    const firstFeature = captured[captured.length - 1].feature;

    rerender(
      <Provider store={store}>
        <LayerPrism {...baseProps} entity={entityA2} />
      </Provider>,
    );

    expect(captured[captured.length - 1].feature).toBe(firstFeature);
  });
});
