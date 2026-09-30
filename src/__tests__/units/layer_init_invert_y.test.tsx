import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../../reducers/index';
import rootSaga from '../../sagas/index';
import LayerInit from '../../layer_init';
import { updateLayout } from '../../actions/layout';
import { toggleInvertY } from '../../actions/invert_y';
import { toggleThresholdIsEdit } from '../../actions/threshold';
import { ExtractJcamp } from '../../helpers/chem';
import { LIST_LAYOUT } from '../../constants/list_layout';
import dscJcamp from '../fixtures/dsc_jcamp';
import cvJcamp from '../fixtures/cyclic_voltammetry_1';
import plainJcamp from '../fixtures/plain_layout_jcamp';
import hplcUvVisJcamp from '../fixtures/hplc_uvvis_jcamp';

// Real reducers, sagas and LayerInit; only the SVG painting is stubbed. InitScale is
// wrapped, not replaced, so each test can read the y range the focus actually drew with
// (a plain wrapper, since CRA's jest config resets jest.fn implementations per test).
jest.mock('../../components/common/draw', () => ({
  drawMain: jest.fn(),
  drawLabel: jest.fn(),
  drawDisplay: jest.fn(),
  drawDestroy: jest.fn(),
  drawArrowOnCurve: jest.fn(),
}));
jest.mock('../../helpers/init', () => {
  const actual = jest.requireActual('../../helpers/init');
  const scaleCalls = [];
  return {
    ...actual,
    scaleCalls,
    InitScale: (...args) => {
      const scales = actual.InitScale(...args);
      scaleCalls.push(scales);
      return scales;
    },
  };
});
const { scaleCalls } = jest.requireMock('../../helpers/init');

const baseProps = {
  others: { others: [], addOthersCb: false },
  cLabel: '',
  xLabel: '',
  yLabel: '',
  molSvg: '',
  editorOnly: true,
  exactMass: '',
  forecast: { molecule: {}, predictions: {} },
  operations: [],
  descriptions: [],
  canChangeDescription: false,
  onDescriptionChanged: () => {},
  multiEntities: [],
  entityFileNames: [],
};

const buildStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(rootSaga);
  return store;
};

// ##$CSINVERTY=true in the spectrum block, as chem-spectra-app writes it. `tweak`
// changes the content so entitySignature differs, as for a refresh.
const withInvertY = (source: string) => {
  const marker = '##DATA CLASS=';
  const out = source.replace(marker, `##$CSINVERTY=true\n${marker}`);
  expect(out).not.toEqual(source);
  return out;
};
const buildEntity = (source: string, tweak = 0) => {
  const entity: any = ExtractJcamp(source);
  entity.spectra = entity.spectra.map((s: any) => ({
    ...s,
    data: s.data.map((d: any) => ({ ...d, y: d.y.map((v: number) => v + tweak) })),
  }));
  return entity;
};

const lastYRange = () => scaleCalls[scaleCalls.length - 1].y.range();
const isDrawnInverted = () => {
  const [top, bottom] = lastYRange();
  return top < bottom;
};

const mount = (store, entity, key = 'dataset-1') => render(
  <Provider store={store}><LayerInit key={key} {...baseProps} entity={entity} /></Provider>,
);

beforeEach(() => { scaleCalls.length = 0; });

describe('LayerInit — y-axis inversion seeded from ##$CSINVERTY', () => {
  it('draws the y-axis as today for a file without the record', () => {
    const store = buildStore();
    mount(store, buildEntity(dscJcamp));
    expect(store.getState().yInverted).toBe(false);
    expect(isDrawnInverted()).toBe(false);
  });

  it('draws the y-axis inverted for a file with the record', () => {
    const store = buildStore();
    const entity = buildEntity(withInvertY(dscJcamp));
    expect(entity.features.editPeak?.invertedY ?? entity.features.autoPeak?.invertedY).toBe(true);
    mount(store, entity);
    expect(store.getState().yInverted).toBe(true);
    expect(isDrawnInverted()).toBe(true);
  });

  it('draws a multi-curve (CV) file with the record inverted', () => {
    const store = buildStore();
    mount(store, buildEntity(withInvertY(cvJcamp)));
    expect(store.getState().yInverted).toBe(true);
    expect(isDrawnInverted()).toBe(true);
  });

  it('flips a multi-curve (CV) axis when the user toggles it', () => {
    const store = buildStore();
    mount(store, buildEntity(cvJcamp));
    expect(isDrawnInverted()).toBe(false);
    act(() => { store.dispatch(toggleInvertY()); });
    expect(isDrawnInverted()).toBe(true);
  });

  it('flips the drawn axis when the user toggles it', () => {
    const store = buildStore();
    mount(store, buildEntity(dscJcamp));
    act(() => { store.dispatch(toggleInvertY()); });
    expect(isDrawnInverted()).toBe(true);
    act(() => { store.dispatch(toggleInvertY()); });
    expect(isDrawnInverted()).toBe(false);
  });
});

describe('LayerInit — a user toggle of the y-axis', () => {
  it('survives the ForecastViewer swap', () => {
    const store = buildStore();
    mount(store, buildEntity(plainJcamp));
    act(() => { store.dispatch(toggleInvertY()); });
    act(() => { store.dispatch(updateLayout(LIST_LAYOUT.H1)); });
    expect(store.getState().yInverted).toBe(true);
    expect(isDrawnInverted()).toBe(true);
  });

  // The toggle only swaps the feature (and so dispatches RESETALL) for an entity with
  // edit peaks, which this HPLC UV/VIS fixture has.
  it('survives a threshold edit toggle', () => {
    const store = buildStore();
    const entity = buildEntity(hplcUvVisJcamp);
    expect(entity.features.editPeak.data[0].x.length).toBeGreaterThan(0);
    mount(store, entity);
    act(() => { store.dispatch(toggleInvertY()); });
    act(() => { store.dispatch(toggleThresholdIsEdit()); });
    expect(store.getState().yInverted).toBe(true);
    expect(isDrawnInverted()).toBe(true);
  });

  it('survives a refresh of the same dataset', () => {
    const store = buildStore();
    const { rerender } = mount(store, buildEntity(dscJcamp));
    act(() => { store.dispatch(toggleInvertY()); });
    rerender(
      <Provider store={store}>
        <LayerInit key="dataset-1" {...baseProps} entity={buildEntity(dscJcamp, 1)} />
      </Provider>,
    );
    expect(store.getState().yInverted).toBe(true);
    expect(isDrawnInverted()).toBe(true);
  });

  it('is dropped when the host remounts the editor for another dataset', () => {
    const store = buildStore();
    const { rerender } = mount(store, buildEntity(dscJcamp));
    act(() => { store.dispatch(toggleInvertY()); });
    rerender(
      <Provider store={store}>
        <LayerInit key="dataset-2" {...baseProps} entity={buildEntity(dscJcamp, 1)} />
      </Provider>,
    );
    expect(store.getState().yInverted).toBe(false);
    expect(isDrawnInverted()).toBe(false);
  });

  it('gives way to a file in the same mount whose own request differs', () => {
    const store = buildStore();
    const { rerender } = mount(store, buildEntity(withInvertY(dscJcamp)));
    act(() => { store.dispatch(toggleInvertY()); }); // user turns it off
    rerender(
      <Provider store={store}>
        <LayerInit key="dataset-1" {...baseProps} entity={buildEntity(dscJcamp, 1)} />
      </Provider>,
    );
    // The new file does not ask for inversion either, so the user's off stays off;
    // switching back to a file that asks for it takes the file's request again.
    expect(store.getState().yInverted).toBe(false);
    rerender(
      <Provider store={store}>
        <LayerInit key="dataset-1" {...baseProps} entity={buildEntity(withInvertY(dscJcamp), 2)} />
      </Provider>,
    );
    expect(store.getState().yInverted).toBe(true);
    expect(isDrawnInverted()).toBe(true);
  });
});
