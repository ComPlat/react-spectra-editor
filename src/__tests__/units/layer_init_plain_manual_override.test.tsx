import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../../reducers/index';
import rootSaga from '../../sagas/index';
import LayerInit from '../../layer_init';
import { updateLayout, setManualLayoutOverride } from '../../actions/layout';
import { ExtractJcamp } from '../../helpers/chem';
import { LIST_LAYOUT } from '../../constants/list_layout';
import plainJcamp from '../fixtures/plain_layout_jcamp';

// Same harness as layer_prism_single_curve_loop.test.tsx / layer_init_plain_reset.test.tsx:
// real reducers + real saga middleware + the real (unmocked) LayerInit, only the D3/SVG
// painting layer stubbed.
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

// A host keying the editor by dataset (chemotion_ELN does) can refresh the same
// unrecognized-datatype dataset's entity -- a fresh object, so entitySignature still
// differs and execReset still runs -- without ever unmounting LayerInit. idDt is what
// entitySignature (and this fix) key a "same dataset" comparison on.
const buildPlainEntity = (idDt, tweak = 0) => {
  const entity: any = ExtractJcamp(plainJcamp);
  entity.idDt = idDt;
  // A trivial content change so entitySignature differs between calls, mirroring a
  // real "refreshed" entity rather than a byte-identical re-post.
  entity.spectra = entity.spectra.map((s: any) => ({
    ...s,
    data: s.data.map((d: any) => ({ ...d, y: d.y.map((v: number) => v + tweak) })),
  }));
  return entity;
};

// Mirrors exactly what r01_layout.js's onChange now dispatches -- the two actions
// travel together, from the same source, whether or not anything downstream races them.
const pickLayout = (store, datasetId, layout) => {
  store.dispatch(updateLayout(layout));
  store.dispatch(setManualLayoutOverride({ datasetId, layout }));
};

// Review finding S5 (PR #336) and its Copilot follow-up: removing the !entity.layout
// early return in execReset means an unrecognized-datatype entity now always gets its
// layout normalized -- but naively that meant PLAIN landing back over a layout the user
// picked by hand (e.g. '1H', to get NMR tools) every time the same dataset's entity was
// refreshed. S5's first attempt inferred the pick by watching Redux state.layout change
// in componentDidUpdate, which a child's own RESETALL dispatch (independent of any
// entity change) could race or clobber in the very same tick -- most concretely, with a
// real (non-empty) forecast prop (chemotion_ELN "always supplies" one, per S2), the pick
// itself triggers a ViewerLine -> ForecastViewer swap whose fresh mount immediately
// dispatches RESETALL(PLAIN). The pick is now captured at its source instead (the
// dropdown's own dispatch, reducer_layout_override.js), immune to that race.
describe('LayerInit execReset — a manual layout override survives a same-dataset refresh (S5)', () => {
  it('keeps the manually picked layout across a refresh of the same dataset', () => {
    const store = buildStore();

    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} forecast={{}} entity={buildPlainEntity('dataset-1')} />
      </Provider>,
    );
    expect(store.getState().layout).toEqual(LIST_LAYOUT.PLAIN);

    pickLayout(store, 'dataset-1', LIST_LAYOUT.H1);
    expect(store.getState().layout).toEqual(LIST_LAYOUT.H1);

    // Host refreshes the same dataset (same idDt, new content) without remounting.
    rerender(
      <Provider store={store}>
        <LayerInit {...baseProps} forecast={{}} entity={buildPlainEntity('dataset-1', 1)} />
      </Provider>,
    );

    expect(store.getState().layout).toEqual(LIST_LAYOUT.H1);
  });

  it('still resets to PLAIN when the dataset actually changes', () => {
    const store = buildStore();

    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} forecast={{}} entity={buildPlainEntity('dataset-1')} />
      </Provider>,
    );
    pickLayout(store, 'dataset-1', LIST_LAYOUT.H1);
    expect(store.getState().layout).toEqual(LIST_LAYOUT.H1);

    // A genuinely different, also-unrecognized dataset must not inherit the
    // previous dataset's manual override.
    rerender(
      <Provider store={store}>
        <LayerInit {...baseProps} forecast={{}} entity={buildPlainEntity('dataset-2')} />
      </Provider>,
    );

    expect(store.getState().layout).toEqual(LIST_LAYOUT.PLAIN);
  });

  // NOT fixed here, and deliberately not asserted: with a real (non-empty) forecast
  // prop -- chemotion_ELN "always supplies" one, per S2 -- picking a non-PLAIN layout
  // for a PLAIN entity swaps Content from ViewerLine to ForecastViewer, whose fresh
  // inner viewer's own componentDidMount unconditionally dispatches RESETALL carrying
  // the entity's own (still PLAIN) operation.layout. Capturing the pick at its source
  // (pickLayout, above, via reducer_layout_override.js) means that first clobber no
  // longer erases the *override* -- a later same-dataset refresh's execReset correctly
  // reads it back and dispatches updateLayoutAct('1H') again. But that dispatch is
  // itself state.layout going PLAIN -> '1H', which swaps Content to ForecastViewer
  // *again*, whose fresh mount dispatches RESETALL('PLAIN') *again* -- re-clobbering
  // the very dispatch that just fixed it, in the same tick. Confirmed by instrumenting
  // the actual dispatch sequence: LAYOUT_SET_CURRENT_DATASET, UPDATE_LAYOUT('1H')
  // (execReset correctly restoring the override), then RESET_ALL(PLAIN) once more
  // (ForecastViewer's fresh mount). A reactive "detect state.layout drifted from the
  // override and redispatch" fix would re-trigger this same swap-and-clobber on its
  // own correction and loop forever -- confirmed by tracing it, not just suspected.
  // The only fix that does not loop is having mountChart's RESETALL dispatch (d3_line/
  // index.js, and the structurally identical d3_rect/d3_multi) stop unconditionally
  // trusting the entity's own static operation.layout and defer to the current
  // authoritative layout (state.layout, or a matching override) instead -- the same
  // territory as the S2 architecture discussion already deferred to the team, now with
  // a second, independent reason to have it.

  // Copilot follow-up: excluding PLAIN from what gets recorded (S5's first attempt)
  // meant an explicit "back to plain" choice never overwrote an older cached override,
  // which then reappeared on the next same-dataset refresh. Recording every pick,
  // PLAIN included, fixes this.
  it('remembers an explicit PLAIN selection instead of reapplying an older cached override', () => {
    const store = buildStore();

    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} forecast={{}} entity={buildPlainEntity('dataset-1')} />
      </Provider>,
    );
    pickLayout(store, 'dataset-1', LIST_LAYOUT.H1);
    expect(store.getState().layout).toEqual(LIST_LAYOUT.H1);

    // The user explicitly goes back to PLAIN by hand.
    pickLayout(store, 'dataset-1', LIST_LAYOUT.PLAIN);
    expect(store.getState().layout).toEqual(LIST_LAYOUT.PLAIN);

    // A later refresh of the same dataset must not resurrect the earlier H1 pick.
    rerender(
      <Provider store={store}>
        <LayerInit {...baseProps} forecast={{}} entity={buildPlainEntity('dataset-1', 1)} />
      </Provider>,
    );

    expect(store.getState().layout).toEqual(LIST_LAYOUT.PLAIN);
  });
});
