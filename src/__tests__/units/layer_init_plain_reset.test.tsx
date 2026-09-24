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

// Review finding S3 (PR #336): execReset's PLAIN branch used to fall into the generic
// `else`, which only resets multiplicity -- integration, multiplicity and meta data
// from whichever spectrum was previously open at this curveIdx survived untouched.
// Invisible in the UI (PLAIN hides integrals), but a host's submit/export path still
// reads that stale state and saves it against the PLAIN spectrum -- carried-over NMR
// or DSC state on exactly the entity type this PR says gets none of that.
describe('LayerInit execReset — PLAIN clears per-curve state instead of inheriting it (S3)', () => {
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
