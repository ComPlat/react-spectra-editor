import React from 'react';
import { render } from '@testing-library/react';
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

// forecast is deliberately EMPTY here (unlike layer_prism_single_curve_loop.test.tsx's
// baseProps), so Content never swaps between ViewerLine and ForecastViewer as layoutSt
// changes. That swap is its own, separate source of a spurious RESETALL (see the
// "also found" note below) -- this file isolates the one mechanism layer_init.js:94
// actually controls.
const baseProps = {
  others: { others: [], addOthersCb: false },
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

// Review finding S5 (PR #336): removing the !entity.layout early return in execReset
// means an unrecognized-datatype entity now always gets its layout normalized -- but
// naively that meant PLAIN landing back over a layout the user picked by hand (e.g.
// '1H', to get NMR tools) every time the same dataset's entity was refreshed.
describe('LayerInit execReset — a manual layout override survives a same-dataset refresh (S5)', () => {
  it('keeps the manually picked layout across a refresh of the same dataset', () => {
    const store = buildStore();

    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={buildPlainEntity('dataset-1')} />
      </Provider>,
    );
    expect(store.getState().layout).toEqual(LIST_LAYOUT.PLAIN);

    // The user picks a layout by hand from the dropdown -- dispatches
    // updateLayoutAct directly, bypassing execReset entirely.
    store.dispatch(updateLayout(LIST_LAYOUT.H1));
    expect(store.getState().layout).toEqual(LIST_LAYOUT.H1);

    // Host refreshes the same dataset (same idDt, new content) without remounting.
    rerender(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={buildPlainEntity('dataset-1', 1)} />
      </Provider>,
    );

    expect(store.getState().layout).toEqual(LIST_LAYOUT.H1);
  });

  it('still resets to PLAIN when the dataset actually changes', () => {
    const store = buildStore();

    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={buildPlainEntity('dataset-1')} />
      </Provider>,
    );
    store.dispatch(updateLayout(LIST_LAYOUT.H1));
    expect(store.getState().layout).toEqual(LIST_LAYOUT.H1);

    // A genuinely different, also-unrecognized dataset must not inherit the
    // previous dataset's manual override.
    rerender(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={buildPlainEntity('dataset-2')} />
      </Provider>,
    );

    expect(store.getState().layout).toEqual(LIST_LAYOUT.PLAIN);
  });

  // NOT fixed here, and deliberately not asserted: with a real (non-empty) forecast
  // prop -- chemotion_ELN "always supplies" one, per S2 -- picking a non-PLAIN
  // layout makes Content swap from ViewerLine to ForecastViewer. That swap mounts a
  // *fresh* inner viewer instance, whose own componentDidMount unconditionally
  // dispatches RESETALL carrying the entity's own (still PLAIN) operation.layout,
  // clobbering the pick back to PLAIN in the same tick as the pick itself -- before
  // this file's mechanism (which relies on componentDidUpdate observing the pick as
  // its own, distinct commit) ever gets a chance to record it; React/Redux can batch
  // the pick and the clobber into one commit, making the intermediate 'real layout'
  // state invisible to LayerInit entirely. See the PR discussion for review finding
  // S5 for why this needs either a riskier reactive-restore (real infinite-loop risk
  // once ForecastViewer's swap-on-mount is in the loop) or a more invasive change
  // overlapping the S2 architecture discussion, rather than being folded in here.
});
