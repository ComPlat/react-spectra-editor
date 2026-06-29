import { isLcmsMsPageLoading } from '../../../components/d3_line_rect/index';
import { pickTicIndex } from '../../../components/d3_line_rect/multi_focus';
import RectFocus from '../../../components/d3_line_rect/rect_focus';

describe('isLcmsMsPageLoading', () => {
  const buildMzEntity = (polarity, pageValues) => ({
    layout: 'LC/MS',
    lcmsKind: 'mz',
    lcmsPolarity: polarity,
    features: pageValues.map((pageValue) => ({
      pageValue,
      data: [{ x: [100, 101], y: [10, 5] }],
    })),
  });

  it('returns true when the requested RT is not available yet', () => {
    const state = {
      tic: {
        polarity: 'positive',
        currentPageValue: 2.5,
      },
    };

    expect(isLcmsMsPageLoading([
      buildMzEntity('positive', [1.2]),
    ], state)).toEqual(true);
  });

  it('returns false when the requested RT is already present', () => {
    const state = {
      tic: {
        polarity: 'negative',
        currentPageValue: 2.5,
      },
    };

    expect(isLcmsMsPageLoading([
      buildMzEntity('positive', [1.2]),
      buildMzEntity('negative', [2.5]),
    ], state)).toEqual(false);
  });

  it('prefers persisted polarity over default curveIdx when reopening the editor', () => {
    const ticEntities = [
      { lcmsPolarity: 'positive' },
      { lcmsPolarity: 'negative' },
    ];
    expect(pickTicIndex(ticEntities, 0, 'negative')).toEqual(1);
  });

  it('falls back to curveIdx when polarity is unavailable', () => {
    const ticEntities = [
      { lcmsPolarity: 'positive' },
      { lcmsPolarity: 'negative' },
    ];
    expect(pickTicIndex(ticEntities, 1, null)).toEqual(1);
  });

  it('returns true when no MS page has been received yet', () => {
    const state = {
      tic: {
        polarity: 'positive',
        currentPageValue: 2.5,
      },
    };

    expect(isLcmsMsPageLoading([], state)).toEqual(true);
  });
});

// Review finding B7 (#232): drawBar reads tTrEndPts[0].y. Clearing the
// threshold makes convertThresEndPts return [] (see chem.test.tsx) while the
// MS bars are still present, so drawBar must guard the empty endpoint list
// instead of crashing.
describe('RectFocus.drawBar with an empty threshold-endpoint list (B7)', () => {
  it('does not crash when tTrEndPts is empty but bars exist', () => {
    const rf = Object.create(RectFocus.prototype);
    rf.bars = {}; // truthy → passes the `if (!this.bars)` guard
    rf.scales = { x: (v) => v, y: (v) => v }; // TfRescale reads focus.scales.{x,y}
    rf.updatePathCall = () => {}; // stub out the d3 path update
    rf.data = [{ x: 1, y: 2 }]; // bars present
    rf.tTrEndPts = []; // cleared threshold → empty endpoints
    expect(() => rf.drawBar()).not.toThrow();
  });
});
