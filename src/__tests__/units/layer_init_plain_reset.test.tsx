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
import { ExtractJcamp } from '../../helpers/chem';
import { LIST_LAYOUT } from '../../constants/list_layout';
import nmr1HJcamp from '../fixtures/nmr1h_jcamp';
import dscJcamp from '../fixtures/dsc_jcamp';
import plainJcamp from '../fixtures/plain_layout_jcamp';

// Same harness as layer_prism_single_curve_loop.test.tsx: real reducers + real saga
// middleware + the real (unmocked) LayerInit, only the D3/SVG painting layer stubbed.
jest.mock('../../components/common/draw', () => ({
  drawMain: jest.fn(),
  drawLabel: jest.fn(),
  drawDisplay: jest.fn(),
  drawDestroy: jest.fn(),
  drawArrowOnCurve: jest.fn(),
}));

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

// The PLAIN chart hides integrals and multiplets, but a host's submit/export path
// still reads them -- state left over from the previous spectrum at this curveIdx
// would be saved against the PLAIN one.
describe('LayerInit execReset — PLAIN clears per-curve state instead of inheriting it', () => {
  it('clears multiplicity left over from a previously open NMR entity', () => {
    const store = buildStore();

    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={ExtractJcamp(nmr1HJcamp)} />
      </Provider>,
    );
    const { multiplicities: before } = store.getState().multiplicity.present;
    expect(before[0].stack.length).toBeGreaterThan(0); // sanity: real multiplet data loaded

    rerender(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={ExtractJcamp(plainJcamp)} />
      </Provider>,
    );

    const { multiplicities: after } = store.getState().multiplicity.present;
    expect(after[0].stack).toEqual([]);
  });

  it('clears DSC metadata left over from a previously open DSC entity', () => {
    const store = buildStore();

    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={ExtractJcamp(dscJcamp)} />
      </Provider>,
    );
    expect(store.getState().meta.dscMetaData).toEqual({ meltingPoint: '1.5', tg: '6' });

    rerender(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={ExtractJcamp(plainJcamp)} />
      </Provider>,
    );

    expect(store.getState().meta.dscMetaData).toBeUndefined();
  });
});

// A host-constructed entity can skip readLayout and hand over a falsy layout.
describe('LayerInit execReset — normalizes a host-constructed falsy layout on first mount', () => {
  it('sets state.layout to PLAIN, not the reducer default, for an entity whose layout is false', () => {
    const store = buildStore();
    const hostEntity = { ...ExtractJcamp(plainJcamp), layout: false };

    render(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={hostEntity} />
      </Provider>,
    );

    expect(store.getState().layout).toEqual(LIST_LAYOUT.PLAIN);
  });
});

// baseProps carries a real forecast, as chemotion_ELN always does: picking an NMR
// layout swaps Content to ForecastViewer, whose freshly mounted viewer dispatches
// RESETALL with the entity's own (PLAIN) feature.
describe('LayerInit — layout of an unrecognised entity with a forecast', () => {
  it('still lands on PLAIN when switching from an NMR entity', () => {
    const store = buildStore();

    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={ExtractJcamp(nmr1HJcamp)} />
      </Provider>,
    );
    expect(store.getState().layout).toEqual(LIST_LAYOUT.H1);

    rerender(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={ExtractJcamp(plainJcamp)} />
      </Provider>,
    );

    expect(store.getState().layout).toEqual(LIST_LAYOUT.PLAIN);
  });

  it('keeps a layout picked by hand instead of the remounted viewer resetting it', () => {
    const store = buildStore();

    render(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={ExtractJcamp(plainJcamp)} />
      </Provider>,
    );
    expect(store.getState().layout).toEqual(LIST_LAYOUT.PLAIN);

    act(() => {
      store.dispatch(updateLayout(LIST_LAYOUT.H1));
    });

    expect(store.getState().layout).toEqual(LIST_LAYOUT.H1);
  });
});
