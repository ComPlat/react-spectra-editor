import layoutOverrideReducer from '../../../reducers/reducer_layout_override';
import { LAYOUT } from '../../../constants/action_type';

describe('reducer_layout_override', () => {
  it('defaults to no current dataset and no override', () => {
    expect(layoutOverrideReducer(undefined, { type: '@@INIT' })).toEqual({
      currentDatasetId: null,
      override: null,
    });
  });

  it('SET_CURRENT_DATASET updates only currentDatasetId, keeping the override', () => {
    const state = { currentDatasetId: null, override: { datasetId: 'a', layout: '1H' } };
    const next = layoutOverrideReducer(state, {
      type: LAYOUT.SET_CURRENT_DATASET,
      payload: 'b',
    });
    expect(next).toEqual({ currentDatasetId: 'b', override: { datasetId: 'a', layout: '1H' } });
  });

  it('SET_MANUAL_OVERRIDE updates only the override, keeping currentDatasetId', () => {
    const state = { currentDatasetId: 'a', override: null };
    const next = layoutOverrideReducer(state, {
      type: LAYOUT.SET_MANUAL_OVERRIDE,
      payload: { datasetId: 'a', layout: 'PLAIN' },
    });
    expect(next).toEqual({ currentDatasetId: 'a', override: { datasetId: 'a', layout: 'PLAIN' } });
  });

  // Review finding on PR #336 (Copilot, second pass): RESETALL must never be able to
  // touch this slice -- it is the one thing that makes a manual pick immune to being
  // raced or clobbered by a child's RESETALL dispatch (see execReset's comment,
  // layer_init.js). Any other action type is a no-op here.
  it('ignores RESETALL and any other action type', () => {
    const state = { currentDatasetId: 'a', override: { datasetId: 'a', layout: '1H' } };
    const next = layoutOverrideReducer(state, { type: 'RESET_ALL', payload: {} });
    expect(next).toBe(state);
  });
});
