import layoutReducer from '../../../reducers/reducer_layout';
import { LAYOUT, MANAGER } from '../../../constants/action_type';
import { LIST_LAYOUT } from '../../../constants/list_layout';

describe('reducer_layout', () => {
  // layer_content.js decides whether to mount ForecastViewer from this slice before
  // LayerInit.execReset has run, so a C13 default lets the common NMR case mount it
  // directly instead of swapping to it a tick later.
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

  // PLAIN on a feature means "unrecognised datatype", not a layout choice: a viewer
  // remounting under a layout the user picked (the ForecastViewer swap) must not
  // reset that pick. LayerInit.execReset owns setting PLAIN on an entity change.
  it('RESETALL keeps the current layout when the feature\'s layout is PLAIN', () => {
    expect(layoutReducer(LIST_LAYOUT.H1, {
      type: MANAGER.RESETALL,
      payload: { operation: { layout: LIST_LAYOUT.PLAIN } },
    })).toEqual(LIST_LAYOUT.H1);
  });

  it('RESETALL keeps the current layout when operation.layout is missing', () => {
    expect(layoutReducer(LIST_LAYOUT.C13, {
      type: MANAGER.RESETALL,
      payload: { operation: {} },
    })).toEqual(LIST_LAYOUT.C13);
    expect(layoutReducer(LIST_LAYOUT.C13, {
      type: MANAGER.RESETALL,
      payload: {},
    })).toEqual(LIST_LAYOUT.C13);
  });
});
