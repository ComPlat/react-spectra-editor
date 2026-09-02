import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../../reducers/index';
import rootSaga from '../../sagas/index';
import LayerInit from '../../layer_init';
import { ExtractJcamp } from '../../helpers/chem';
import irJcamp from '../fixtures/ir_jcamp';
import nmr13cJcamp from '../fixtures/nmr13c_jcamp';

// Real reducers + real saga middleware + the real (unmocked) LayerInit ->
// LayerPrism -> Content -> ForecastViewer -> ViewerLine chain, per the
// "Maximum update depth exceeded" reports on issue #329. Only the D3/SVG
// painting layer is stubbed (jsdom has no real layout engine for it) -
// componentDidMount/componentDidUpdate/normChange, and the real LineFocus
// class, all run for real. (An earlier version of this test mocked
// LineFocus away entirely, which was harmless here - LineFocus never
// dispatches outside of click handlers - but keeping it real removes any
// doubt for a case this precise.)
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

const buildStoreWithActionLog = () => {
  const actionLog: string[] = [];
  const logMiddleware = () => (next: any) => (action: any) => {
    actionLog.push(action.type);
    // A real infinite loop would keep growing this well past any sane
    // count; fail loudly instead of letting the test hang.
    if (actionLog.length > 500) {
      throw new Error(`Dispatch runaway detected: ${actionLog.slice(-20).join(', ')} ... (${actionLog.length} total)`);
    }
    return next(action);
  };
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(rootReducer, applyMiddleware(logMiddleware, sagaMiddleware));
  sagaMiddleware.run(rootSaga);
  return { store, actionLog };
};

describe('LayerPrism/ViewerLine single-curve session dispatch behavior (issue #329 follow-up)', () => {
  it('mounts a single IR entity with a small, bounded number of dispatches', () => {
    const { store, actionLog } = buildStoreWithActionLog();
    const entity: any = ExtractJcamp(irJcamp);

    render(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={entity} />
      </Provider>,
    );

    expect(actionLog.length).toBeLessThan(20);
  });

  // The exact reproduction from issue #329's live dispatch-logged trace: a
  // single 13C NMR entity (curveIdx 0, not multi-curve), re-rendered
  // repeatedly with a fresh-but-content-equal entity object each time (as a
  // host with no memoization on its side does). Before the layer_prism.js
  // fix, this produced an unbounded RESET_ALL/RESET_SHIFT ping-pong (2
  // dispatches per re-render, forever, as the host kept re-rendering) -
  // ViewerLine.normChange dispatches MANAGER.RESETALL whenever its `feature`
  // prop's reference changes, and layer_prism.js rebuilt `feature` fresh via
  // an unmemoized extractParams() call on every render, regardless of
  // whether entity/thresSt/scanSt actually changed content.
  it('re-rendering with fresh-but-equivalent 13C entity (host churn) dispatches nothing further', () => {
    const { store, actionLog } = buildStoreWithActionLog();
    const build = () => ExtractJcamp(nmr13cJcamp);

    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={build()} />
      </Provider>,
    );
    const afterMount = actionLog.length;

    for (let i = 0; i < 40; i += 1) {
      rerender(
        <Provider store={store}>
          <LayerInit {...baseProps} entity={build()} />
        </Provider>,
      );
    }

    expect(actionLog.length).toEqual(afterMount);
  });

  it('still resets when the entity genuinely changes', () => {
    const { store, actionLog } = buildStoreWithActionLog();

    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={ExtractJcamp(nmr13cJcamp)} />
      </Provider>,
    );
    const afterMount = actionLog.length;

    rerender(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={ExtractJcamp(irJcamp)} />
      </Provider>,
    );

    expect(actionLog.length).toBeGreaterThan(afterMount);
    expect(actionLog.slice(afterMount)).toContain('RESET_ALL');
  });
});
