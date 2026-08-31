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

// Real reducers + real saga middleware + the real (unmocked) LayerInit ->
// LayerPrism -> Content -> ForecastViewer -> ViewerLine chain, per the
// "Maximum update depth exceeded" reports on issue #329. Only the D3/SVG
// painting layer is stubbed (jsdom has no real layout engine for it) -
// componentDidMount/componentDidUpdate/normChange all run for real.
jest.mock('../../components/common/draw', () => ({
  drawMain: jest.fn(),
  drawLabel: jest.fn(),
  drawDisplay: jest.fn(),
  drawDestroy: jest.fn(),
  drawArrowOnCurve: jest.fn(),
}));

jest.mock('../../components/d3_line/line_focus', () => ({
  __esModule: true,
  default: class MockLineFocus {
    create() {}

    update() {}
  },
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

  it('re-rendering with fresh-but-equivalent entity/forecast (host churn) stays bounded per render, not exponential', () => {
    const { store, actionLog } = buildStoreWithActionLog();

    const { rerender } = render(
      <Provider store={store}>
        <LayerInit {...baseProps} entity={ExtractJcamp(irJcamp)} forecast={{ molecule: {}, predictions: {} }} />
      </Provider>,
    );
    const afterMount = actionLog.length;

    for (let i = 0; i < 20; i += 1) {
      rerender(
        <Provider store={store}>
          <LayerInit
            {...baseProps}
            entity={ExtractJcamp(irJcamp)}
            forecast={{ molecule: {}, predictions: {} }}
          />
        </Provider>,
      );
    }

    // ViewerLine.normChange still resets on every render (feature is
    // rebuilt fresh by the unmemoized extractParams call in layer_prism.js),
    // so each churned re-render adds a small constant number of dispatches -
    // this is wasteful but bounded, not a cycle. ForecastViewer no longer
    // contributes to this count (fixed: compares forecast by content).
    const perRenderDispatches = (actionLog.length - afterMount) / 20;
    expect(perRenderDispatches).toBeLessThanOrEqual(5);
  });
});
