import layoutReducer from '../../../reducers/reducer_layout';
import { LAYOUT, MANAGER } from '../../../constants/action_type';
import { LIST_LAYOUT } from '../../../constants/list_layout';

describe('reducer_layout', () => {
  // Review finding S2 (PR #336): reverted from LIST_LAYOUT.PLAIN back to C13. See the
  // comment on initialState in reducer_layout.js for why PLAIN here was never
  // load-bearing for the unrecognized-datatype fix (B2 covers that) and cost a
  // ForecastViewer double-mount on the first NMR/IR/UVVIS/XRD entity of a page session.
  it('defaults to C13, matching what chemotion_ELN is tuned around', () => {
    expect(layoutReducer(undefined, { type: '@@INIT' })).toEqual(LIST_LAYOUT.C13);
  });

  it('LAYOUT.UPDATE sets the layout directly', () => {
    expect(layoutReducer(LIST_LAYOUT.PLAIN, {
      type: LAYOUT.UPDATE,
      payload: LIST_LAYOUT.C13,
    })).toEqual(LIST_LAYOUT.C13);
  });

  it('RESETALL adopts the dispatched feature\'s own operation.layout', () => {
    expect(layoutReducer(LIST_LAYOUT.PLAIN, {
      type: MANAGER.RESETALL,
      payload: { operation: { layout: LIST_LAYOUT.MS } },
    })).toEqual(LIST_LAYOUT.MS);
  });

  // Regression (review finding B2): a child component (e.g. ViewerLine.normChange)
  // dispatches RESETALL with the *new* entity's feature ahead of
  // LayerInit.execReset. For an unrecognized-datatype entity whose feature carries
  // no (or a falsy) operation.layout, falling back to the stale `state` here left
  // the Redux layout on whatever the *previous* entity used for one render -- e.g.
  // an NMR layout, with its reversed axis and shift handling, drawing a spectrum
  // that has no such basis. The fallback must be the same neutral PLAIN every
  // other consumer converges on, never the leftover state.
  it('RESETALL falls back to PLAIN, not the stale previous layout, when operation.layout is missing', () => {
    expect(layoutReducer(LIST_LAYOUT.C13, {
      type: MANAGER.RESETALL,
      payload: { operation: {} },
    })).toEqual(LIST_LAYOUT.PLAIN);
  });

  it('RESETALL falls back to PLAIN when the payload itself is missing operation', () => {
    expect(layoutReducer(LIST_LAYOUT.C13, {
      type: MANAGER.RESETALL,
      payload: {},
    })).toEqual(LIST_LAYOUT.PLAIN);
  });
});
