import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import LayerInit from '../../layer_init';
import { CURVE } from '../../constants/action_type';
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
  layout: LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
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

// Two distinct entities that are equivalent in content (same layout/title/x data)
// but built fresh each time - mimicking a host re-render that rebuilds arrays
// via `.map()`/object literals on every render without changing what they mean.
const buildEquivalentMultiEntities = () => ([
  {
    layout: LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
    title: 'curve-a',
    spectra: [{ data: [{ x: [1, 2, 3], y: [1, 2, 3] }] }],
  },
  {
    layout: LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
    title: 'curve-b',
    spectra: [{ data: [{ x: [4, 5, 6], y: [4, 5, 6] }] }],
  },
]);

describe('LayerInit — multi-curve host prop churn does not re-dispatch SET_ALL_CURVES', () => {
  it('does not dispatch SET_ALL_CURVES again when re-rendered with content-equivalent (but new-reference) multiEntities/entity', () => {
    const store = mockStore(storeState);
    const entityA = buildEquivalentMultiEntities()[0];
    const multiEntitiesA = buildEquivalentMultiEntities();

    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={entityA} multiEntities={multiEntitiesA} />
      </Provider>,
    );

    const setAllCurvesCountAfterMount = store.getActions()
      .filter((a) => a.type === CURVE.SET_ALL_CURVES).length;
    expect(setAllCurvesCountAfterMount).toBe(1);

    // Simulate a host re-render that rebuilds equivalent-but-new entity/array
    // references, as described in issue #329.
    for (let i = 0; i < 5; i += 1) {
      const entityB = buildEquivalentMultiEntities()[0];
      const multiEntitiesB = buildEquivalentMultiEntities();
      rerender(
        <Provider store={store}>
          <LayerInit {...baseProps} entity={entityB} multiEntities={multiEntitiesB} />
        </Provider>,
      );
    }

    const setAllCurvesCountAfterRerenders = store.getActions()
      .filter((a) => a.type === CURVE.SET_ALL_CURVES).length;
    expect(setAllCurvesCountAfterRerenders).toBe(1);
  });

  it('still dispatches SET_ALL_CURVES when multiEntities meaningfully changes', () => {
    const store = mockStore(storeState);
    const [entityA, entityB] = buildEquivalentMultiEntities();

    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={entityA} multiEntities={[entityA, entityB]} />
      </Provider>,
    );

    const newEntity = {
      layout: LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
      title: 'curve-c',
      spectra: [{ data: [{ x: [7, 8, 9], y: [7, 8, 9] }] }],
    };

    rerender(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={entityA} multiEntities={[entityA, entityB, newEntity]} />
      </Provider>,
    );

    const setAllCurvesCount = store.getActions()
      .filter((a) => a.type === CURVE.SET_ALL_CURVES).length;
    expect(setAllCurvesCount).toBe(2);
  });
});
