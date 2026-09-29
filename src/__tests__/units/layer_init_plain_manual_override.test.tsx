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

// A trivial content change so entitySignature differs between calls, mirroring a real
// "refreshed" entity rather than a byte-identical re-post.
const tweakEntity = (entity, tweak) => ({
  ...entity,
  spectra: entity.spectra.map((s: any) => ({
    ...s,
    data: s.data.map((d: any) => ({ ...d, y: d.y.map((v: number) => v + tweak) })),
  })),
});

// Review finding B3 (PR #336): FN.buildData -- what chemotion_ELN's loadEntity/
// loadEntitySafe actually call (ViewSpectra.js) -- is a pure pass-through
// (helpers/format.js), so the entity chemotion_ELN hands <SpectraEditor> is exactly
// ExtractJcamp's own shape: { spectra, features, layout }, with no idDt/id/datasetId
// anywhere on it. Verified directly against chemotion_ELN@hub/main.
const buildHostShapedEntity = (tweak = 0) => tweakEntity(ExtractJcamp(plainJcamp), tweak);

// A host that DOES attach an id (this repo's own demo, or a future host).
const buildIdentifiedEntity = (idDt, tweak = 0) => (
  { ...tweakEntity(ExtractJcamp(plainJcamp), tweak), idDt }
);

// Mirrors exactly what r01_layout.js's onChange now dispatches -- the two actions
// travel together, from the same source, whether or not anything downstream races them.
const pickLayout = (store, datasetId, layout) => {
  store.dispatch(updateLayout(layout));
  store.dispatch(setManualLayoutOverride({ datasetId, layout }));
};

// Review finding S5 (PR #336) and its Copilot/B3 follow-ups: removing the
// !entity.layout early return in execReset means an unrecognized-datatype entity now
// always gets its layout normalized -- but naively that meant PLAIN landing back over
// a layout the user picked by hand (e.g. '1H', to get NMR tools) whenever anything
// re-triggered execReset for the same dataset. Two independent bugs had to be fixed
// for this to work in chemotion_ELN specifically, not just in this repo's own tests:
//
//  - The override must be captured at its source (the dropdown's own dispatch, via
//    reducer_layout_override.js), not inferred later by diffing Redux state.layout --
//    a child's RESETALL can change that same state in the same tick as the pick.
//  - The override must not require an id to key on. chemotion_ELN's non-LC/MS entity
//    is FN.buildData's pass-through shape -- { spectra, features, layout }, nothing
//    else -- so datasetId is always null there (buildHostShapedEntity, above, models
//    this exactly; the id-based tests further down cover a host that does supply one).
//    componentDidMount clears the override, which is what makes it safe to trust
//    *any* stored override once no id is available to check: chemotion_ELN keys its
//    <SpectraEditor> by dataset (key={`dataset-${id}`}), so a genuine switch to a
//    different dataset remounts this component -- clearing the override -- while a
//    same-dataset refresh does not.
describe('LayerInit execReset — a manual layout override survives a same-dataset refresh (S5, B3)', () => {
  it('keeps the manually picked layout across a refresh, for a host-shaped entity with no id', () => {
    const store = buildStore();

    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} forecast={{}} entity={buildHostShapedEntity()} />
      </Provider>,
    );
    expect(store.getState().layout).toEqual(LIST_LAYOUT.PLAIN);

    pickLayout(store, null, LIST_LAYOUT.H1);
    expect(store.getState().layout).toEqual(LIST_LAYOUT.H1);

    // Host refreshes the same dataset (new content, same LayerInit instance -- no
    // remount) without a key change, exactly as chemotion_ELN's own <SpectraEditor
    // key={...}> would for a refresh of the dataset that key names.
    rerender(
      <Provider store={store}>
        <LayerInit {...baseProps} forecast={{}} entity={buildHostShapedEntity(1)} />
      </Provider>,
    );

    expect(store.getState().layout).toEqual(LIST_LAYOUT.H1);
  });

  it('resets to PLAIN when the host remounts for a genuinely different dataset (key change)', () => {
    const store = buildStore();

    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} key="dataset-1" forecast={{}} entity={buildHostShapedEntity()} />
      </Provider>,
    );
    pickLayout(store, null, LIST_LAYOUT.H1);
    expect(store.getState().layout).toEqual(LIST_LAYOUT.H1);

    // A different key, exactly as chemotion_ELN's key={`dataset-${id}`} would produce
    // for a genuinely different dataset -- React unmounts and remounts LayerInit.
    rerender(
      <Provider store={store}>
        <LayerInit {...baseProps} key="dataset-2" forecast={{}} entity={buildHostShapedEntity()} />
      </Provider>,
    );

    expect(store.getState().layout).toEqual(LIST_LAYOUT.PLAIN);
  });

  it('remembers an explicit PLAIN selection instead of reapplying an older cached override', () => {
    const store = buildStore();

    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} forecast={{}} entity={buildHostShapedEntity()} />
      </Provider>,
    );
    pickLayout(store, null, LIST_LAYOUT.H1);
    expect(store.getState().layout).toEqual(LIST_LAYOUT.H1);

    // The user explicitly goes back to PLAIN by hand.
    pickLayout(store, null, LIST_LAYOUT.PLAIN);
    expect(store.getState().layout).toEqual(LIST_LAYOUT.PLAIN);

    // A later refresh of the same dataset must not resurrect the earlier H1 pick.
    rerender(
      <Provider store={store}>
        <LayerInit {...baseProps} forecast={{}} entity={buildHostShapedEntity(1)} />
      </Provider>,
    );

    expect(store.getState().layout).toEqual(LIST_LAYOUT.PLAIN);
  });

  // A host that does attach an id is still supported, and gets an extra layer of
  // precision from it: the id must also match, on top of the mount-scoping above --
  // useful for a host that reuses the same LayerInit instance across datasets it does
  // identify, rather than remounting via a key the way chemotion_ELN does.
  it('still resets to PLAIN for a different, identified dataset within the same mount', () => {
    const store = buildStore();

    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} forecast={{}} entity={buildIdentifiedEntity('dataset-1')} />
      </Provider>,
    );
    pickLayout(store, 'dataset-1', LIST_LAYOUT.H1);
    expect(store.getState().layout).toEqual(LIST_LAYOUT.H1);

    // No key change here -- the same LayerInit instance is reused, as it would be for
    // a host that does not key <SpectraEditor> by dataset. The id mismatch alone must
    // reject the stale override.
    rerender(
      <Provider store={store}>
        <LayerInit {...baseProps} forecast={{}} entity={buildIdentifiedEntity('dataset-2')} />
      </Provider>,
    );

    expect(store.getState().layout).toEqual(LIST_LAYOUT.PLAIN);
  });

  // NOT fixed here, and deliberately not asserted: with a real (non-empty) forecast
  // prop -- chemotion_ELN "always supplies" one, per S2 -- picking a non-PLAIN layout
  // for a PLAIN entity swaps Content from ViewerLine to ForecastViewer, whose fresh
  // inner viewer's own componentDidMount unconditionally dispatches RESETALL carrying
  // the entity's own (still PLAIN) operation.layout. Capturing the pick at its source
  // means that first clobber no longer erases the *override* -- a later same-dataset
  // refresh's execReset correctly reads it back and dispatches updateLayoutAct('1H')
  // again. But that dispatch is itself state.layout going PLAIN -> '1H', which swaps
  // Content to ForecastViewer *again*, whose fresh mount dispatches RESETALL('PLAIN')
  // *again* -- re-clobbering the very dispatch that just fixed it, in the same tick.
  // Confirmed by instrumenting the actual dispatch sequence, not just reasoning about
  // it. This is not unique to layouts that swap to ForecastViewer, either (review
  // finding B3): ANY layout other than PLAIN routes Content to a different component
  // than PLAIN's own ViewerLine (isMs/isLCMs/showForecast all key off layoutSt), so
  // restoring ANY override this way remounts something, whose own unconditional
  // RESETALL re-clobbers it the same way -- B3's own example is MS/TGA, not just the
  // NMR-type/ForecastViewer case this file's comments previously singled out.
  //
  // Nor is the swap the only trigger: an *ordinary* re-render that never touches the
  // entity prop at all -- a threshold toggle, a scan target change -- rebuilds
  // layer_prism.js's memoized `feature` (useExtractedParams keys on
  // JSON.stringify(thresSt)/scanSt too, not just entitySignature(entity)), which
  // ViewerLine.normChange sees as a reference change and dispatches RESETALL for,
  // exactly like a real entity change would. But entitySignature(entity) itself is
  // unchanged by a threshold toggle, so LayerInit's own entityChanged gate never
  // re-fires execReset to correct the resulting clobber -- nothing here observes or
  // corrects it at all, override-restoration logic included.
  //
  // A reactive "detect state.layout drifted from the override and redispatch" fix
  // would re-trigger the same swap-and-clobber on its own correction and loop
  // forever, for both triggers -- restoring PLAIN's own component back to the
  // override's is a remount exactly as much as the swap-to-ForecastViewer case is.
  // The only fix that does not loop is having mountChart's RESETALL dispatch
  // (d3_line/index.js, and the structurally identical d3_rect/d3_multi) stop
  // unconditionally trusting the entity's own static operation.layout and defer to
  // the current authoritative layout instead -- the same territory as the S2
  // architecture discussion already deferred to the team, now with independent
  // confirmation from two directions that it needs to happen for a manual override
  // to be reliable at all, not just in the one scenario first reported.
});
