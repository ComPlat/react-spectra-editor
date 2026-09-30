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
import { toggleThresholdIsEdit } from '../../actions/threshold';
import { ExtractJcamp } from '../../helpers/chem';
import { LIST_LAYOUT } from '../../constants/list_layout';
import Format from '../../helpers/format';
import nmr1HJcamp from '../fixtures/nmr1h_jcamp';
import dscJcamp from '../fixtures/dsc_jcamp';
import plainJcamp from '../fixtures/plain_layout_jcamp';
import hplcUvVisJcamp from '../fixtures/hplc_uvvis_jcamp';

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

  // Picking MS swaps in ViewerRect, picking IR swaps in ForecastViewer; each remounted
  // viewer dispatches RESETALL with the PLAIN feature. Both use a precision different
  // from PLAIN's, so the submit decimal must follow the kept layout, not the feature.
  it.each([LIST_LAYOUT.MS, LIST_LAYOUT.IR])(
    'keeps the submit precision of a hand-picked %s after the viewer remounts',
    (picked) => {
      const store = buildStore();
      render(
        <Provider store={store}>
          <LayerInit {...baseProps} entity={ExtractJcamp(plainJcamp)} />
        </Provider>,
      );
      expect(store.getState().submit.decimal).toEqual(Format.spectraDigit(LIST_LAYOUT.PLAIN));

      act(() => {
        store.dispatch(updateLayout(picked));
      });

      expect(store.getState().layout).toEqual(picked);
      expect(store.getState().submit.decimal).toEqual(Format.spectraDigit(picked));
    },
  );

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

// Shaped like chemotion_ELN's entity: FN.buildData(ExtractJcamp(...)).entity carries no
// idDt. `tweak` changes the content, so entitySignature differs as for a refresh.
const buildPlainEntity = (tweak = 0, extra = {}) => {
  const entity: any = ExtractJcamp(plainJcamp);
  entity.spectra = entity.spectra.map((s: any) => ({
    ...s,
    data: s.data.map((d: any) => ({ ...d, y: d.y.map((v: number) => v + tweak) })),
  }));
  return { ...entity, ...extra };
};

const pick = (store, layout) => act(() => { store.dispatch(updateLayout(layout)); });

// S5: a layout picked by hand for an unrecognised entity survives what the host does
// to that same dataset, and does not leak into a different one.
describe('LayerInit — a hand-picked layout for an unrecognised entity', () => {
  it('survives a refresh of the same dataset', () => {
    const store = buildStore();
    const { rerender } = render(
      <Provider store={store}><LayerInit {...baseProps} entity={buildPlainEntity()} /></Provider>,
    );
    pick(store, LIST_LAYOUT.H1);

    rerender(
      <Provider store={store}><LayerInit {...baseProps} entity={buildPlainEntity(1)} /></Provider>,
    );

    expect(store.getState().layout).toEqual(LIST_LAYOUT.H1);
  });

  // The toggle only swaps the feature (and so dispatches RESETALL) for an entity with
  // edit peaks: an HPLC UV/VIS file whose datatype nobody recognises.
  it('survives a threshold edit toggle', () => {
    const store = buildStore();
    const entity: any = ExtractJcamp(hplcUvVisJcamp.replace(
      '##DATA TYPE=HPLC UV/VIS SPECTRUM\n', '##DATA TYPE=SQUID\n',
    ));
    expect(entity.layout).toEqual(LIST_LAYOUT.PLAIN);
    expect(entity.features.editPeak.data[0].x.length).toBeGreaterThan(0);
    render(
      <Provider store={store}><LayerInit {...baseProps} entity={entity} /></Provider>,
    );
    // TGA keeps ViewerLine mounted, so only the threshold toggle can reset the pick.
    pick(store, LIST_LAYOUT.TGA);

    act(() => { store.dispatch(toggleThresholdIsEdit()); });

    expect(store.getState().layout).toEqual(LIST_LAYOUT.TGA);
  });

  it('stays PLAIN on a refresh after the user picked PLAIN again', () => {
    const store = buildStore();
    const { rerender } = render(
      <Provider store={store}><LayerInit {...baseProps} entity={buildPlainEntity()} /></Provider>,
    );
    pick(store, LIST_LAYOUT.H1);
    pick(store, LIST_LAYOUT.PLAIN);

    rerender(
      <Provider store={store}><LayerInit {...baseProps} entity={buildPlainEntity(1)} /></Provider>,
    );

    expect(store.getState().layout).toEqual(LIST_LAYOUT.PLAIN);
  });

  it('is dropped when the host remounts the editor for another dataset', () => {
    const store = buildStore();
    const { rerender } = render(
      <Provider store={store}>
        <LayerInit key="dataset-1" {...baseProps} entity={buildPlainEntity()} />
      </Provider>,
    );
    pick(store, LIST_LAYOUT.H1);

    rerender(
      <Provider store={store}>
        <LayerInit key="dataset-2" {...baseProps} entity={buildPlainEntity(1)} />
      </Provider>,
    );

    expect(store.getState().layout).toEqual(LIST_LAYOUT.PLAIN);
  });

  it('is dropped when both entities carry different dataset ids', () => {
    const store = buildStore();
    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={buildPlainEntity(0, { idDt: 1 })} />
      </Provider>,
    );
    pick(store, LIST_LAYOUT.H1);

    rerender(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={buildPlainEntity(1, { idDt: 2 })} />
      </Provider>,
    );

    expect(store.getState().layout).toEqual(LIST_LAYOUT.PLAIN);
  });
});
