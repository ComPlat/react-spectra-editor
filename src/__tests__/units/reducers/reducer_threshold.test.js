import thresholdReducer from '../../../reducers/reducer_threshold';
import { MANAGER } from '../../../constants/action_type';

const thres = (value) => ({
  isEdit: true, value, upper: false, lower: false,
});

describe('threshold reducer: reset to the reference', () => {
  it('uses the reference of the spectrum for a single curve', () => {
    const state = thresholdReducer(
      { selectedIdx: 0, list: [thres(5)] },
      { type: MANAGER.RESETALL, payload: { thresRef: 0.99 } },
    );
    expect(state.list).toEqual([thres(0.99)]);
  });

  // The multi-spectrum chart resets with the selected curve's feature. Each curve has its
  // own reference, so none may take that curve's: clear them, and every consumer falls back
  // to its curve's own `feature.thresRef`.
  it('gives each of several curves its own reference', () => {
    const state = thresholdReducer(
      { selectedIdx: 1, list: [thres(5), thres(7)] },
      { type: MANAGER.RESETALL, payload: { thresRef: 0.99 } },
    );
    expect(state.list).toEqual([thres(false), thres(false)]);
  });
});
