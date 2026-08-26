import { isLcmsMsPageLoading, measurePane, sameSizes } from '../../../components/d3_line_rect/index';
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

// The letterboxing this guards against is a layout effect jsdom cannot observe (it reports
// clientWidth/clientHeight as 0), so what is testable here is the measurement logic and its
// fallback. The claim that the panes actually fill their width rests on browser
// measurement, recorded in the commit message.
describe('measurePane (LC/MS pane sizing)', () => {
  it('returns null for a missing node, so callers fall back to the fixed viewBox', () => {
    expect(measurePane(null)).toBeNull();
    expect(measurePane(undefined)).toBeNull();
  });

  it('returns null for an unlaid-out node rather than a degenerate 0x0 viewBox', () => {
    // This is the jsdom case, and also a pane measured before first paint.
    expect(measurePane({ clientWidth: 0, clientHeight: 0 })).toBeNull();
    expect(measurePane({ clientWidth: 800, clientHeight: 0 })).toBeNull();
  });

  it('measures a laid-out pane', () => {
    expect(measurePane({ clientWidth: 1296, clientHeight: 197 }))
      .toEqual({ width: 1296, height: 197 });
  });

  it('rounds sub-pixel box metrics', () => {
    expect(measurePane({ clientWidth: 1295.6, clientHeight: 196.4 }))
      .toEqual({ width: 1296, height: 196 });
  });

  it('clamps below the focus classes own margins, where a scale range would invert', () => {
    // margins are l:60 r:5 t:5 b:40, so an unclamped 40x20 pane yields a negative
    // drawable width and height.
    expect(measurePane({ clientWidth: 40, clientHeight: 20 }))
      .toEqual({ width: 240, height: 96 });
  });
});

describe('sameSizes (resize guard)', () => {
  const sizes = (w, h) => ({
    line: { width: w, height: h },
    multi: { width: w, height: h },
    rect: { width: w, height: h },
  });

  it('treats a null previous size as different, so the first measure always mounts', () => {
    expect(sameSizes(sizes(100, 50), null)).toBe(false);
  });

  it('is true for identical sizes, which is what stops a resize feedback loop', () => {
    expect(sameSizes(sizes(1296, 197), sizes(1296, 197))).toBe(true);
  });

  it('detects a change in any single pane', () => {
    const a = sizes(1296, 197);
    const b = sizes(1296, 197);
    b.rect = { width: 1296, height: 198 };
    expect(sameSizes(a, b)).toBe(false);
  });
});
