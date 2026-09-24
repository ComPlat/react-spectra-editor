import * as d3 from 'd3';
import {
  isLcmsMsPageLoading,
  UnconnectedViewerLineRect, computeLcmsUnionXExtent, toSeed,
} from '../../../components/d3_line_rect/index';
import LineFocus from '../../../components/d3_line_rect/line_focus';
import MultiFocus, { pickTicIndex } from '../../../components/d3_line_rect/multi_focus';
import RectFocus from '../../../components/d3_line_rect/rect_focus';
import { resolveXExtent, resolveYExtent } from '../../../helpers/resolve_extent';
import { ExtractJcamp, convertTopic } from '../../../helpers/chem';
import { extractParams } from '../../../helpers/extractParams';
import { LIST_LAYOUT } from '../../../constants/list_layout';
import ContainerSize from '../../../helpers/container_size';
import { drawMain } from '../../../components/common/draw';
import lcMsTicChemstationJcamp from '../../fixtures/lc_ms_jcamp_tic_chemstation';
import lcMsUvvisChemstationJcamp from '../../fixtures/lc_ms_jcamp_uvvis_chemstation';

// componentDidMount/componentDidUpdate do real DOM/D3 drawing via these helpers.
// Mocked out so the "wiring" tests below can invoke the real lifecycle methods
// (not a hand-built stand-in) without needing a mounted SVG tree — only
// index.js imports from this module (rect_focus.js does not), so it doesn't
// affect the RectFocus.drawBar test below.
jest.mock('../../../components/common/draw', () => ({
  drawMain: jest.fn(),
  drawLabel: jest.fn(),
  drawDisplay: jest.fn(),
  drawDestroy: jest.fn(),
}));

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
//
// Review finding S4 (PR #336): the original guard (`if (!this.tTrEndPts.length)
// return;`) fixed the crash by skipping the rest of drawBar() entirely, but
// tTrEndPts only decides bar *color* (barColor's above/below-threshold fill) -- none
// of the enter/exit/transform positioning depends on it. Returning early meant an
// empty threshold blanked the chart on mount, or left stale (un-removed,
// un-repositioned) bars on a later update, even though this.data was populated. The
// fix falls back to a neutral yRef (-Infinity, so every bar gets the default color)
// and lets the rest of drawBar() run as normal.
describe('RectFocus.drawBar with an empty threshold-endpoint list (B7 / S4)', () => {
  const buildFocus = () => {
    const root = document.createElement('div');
    const rf = Object.create(RectFocus.prototype);
    rf.bars = d3.select(root); // a real selection: `if (!this.bars)` also passes
    rf.scales = { x: (v) => v, y: (v) => v }; // TfRescale reads focus.scales.{x,y}
    rf.updatePathCall = () => {}; // stub out the d3 path update
    rf.data = [{ x: 1, y: 2 }, { x: 2, y: 3 }]; // bars present
    rf.tTrEndPts = []; // cleared threshold → empty endpoints
    return { root, rf };
  };

  it('does not crash when tTrEndPts is empty but bars exist', () => {
    const { rf } = buildFocus();
    expect(() => rf.drawBar()).not.toThrow();
  });

  it('still draws (not blanks) the bars when tTrEndPts is empty', () => {
    const { root, rf } = buildFocus();
    rf.drawBar();
    const rects = root.querySelectorAll('rect');
    expect(rects.length).toBe(rf.data.length);
    rects.forEach((rect) => expect(rect.getAttribute('fill')).toBe('steelblue'));
  });

  it('still updates (not leaves stale) the bars on a later call with new data', () => {
    const { root, rf } = buildFocus();
    rf.drawBar();

    rf.data = [{ x: 5, y: 9 }];
    rf.drawBar();

    const rects = root.querySelectorAll('rect');
    expect(rects.length).toBe(1);
    expect(rects[0].getAttribute('transform')).toBe('translate(5, 9)');
  });
});

// Review finding S1 (PR #336): this LineFocus (the LC/MS UV/VIS pane) carried its own
// copy of the non-reversed-layout whitelist, missing PLAIN even after
// d3_line/line_focus.js's copy was fixed for it. Now delegates to the single shared
// Format.isNonReversedXLayout.
describe('LineFocus.reverseXAxis (S1, d3_line_rect copy)', () => {
  const lf = Object.create(LineFocus.prototype);

  it('does not reverse the axis for PLAIN', () => {
    expect(lf.reverseXAxis(LIST_LAYOUT.PLAIN)).toBe(false);
  });

  it('still reverses the axis for NMR layouts', () => {
    expect(lf.reverseXAxis(LIST_LAYOUT.C13)).toBe(true);
  });
});

// Review finding S7 (PR #336): measurePane/sameSizes read each pane's live
// clientHeight unconditionally, with only an epsilon guard against redrawing
// forever -- against an unbounded host (nothing here bounds a pane to a
// height that does not depend on its own content) that live height already
// is the previous draw's own height, feeding a genuine, unbounded growth
// loop. Replaced by three per-pane ContainerSize instances (helpers/
// container_size.js, from #335), the same fix d3_line/d3_rect already use:
// an unbounded pane's height is derived from its measured *width* and a
// fixed fallback aspect instead of ever being read back from its own
// clientHeight, so there is nothing left to feed the loop. See
// single_curve_chart_size.test.js for the single-pane version of the test
// below; ContainerSize's own unit behaviour is exercised through both.

// Review finding N2: d3.extent already returns [min, max] sorted, so the
// .sort() that used to follow it was dead work — and it silently let an
// empty/all-undefined data set through as { xL: undefined, xU: undefined },
// which would reach scales.x.domain() as NaN. resolveXExtent drops the sort
// and falls back to a fixed placeholder range instead.
describe('resolveXExtent (N2: dead sort + degenerate empty-data case)', () => {
  it('returns the min/max of the data, unsorted input notwithstanding', () => {
    const data = [{ x: 5 }, { x: 1 }, { x: 3 }];
    expect(resolveXExtent(data, (d) => d.x)).toEqual({ xL: 1, xU: 5 });
  });

  it('falls back to a fixed placeholder range for an empty data array', () => {
    expect(resolveXExtent([], (d) => d.x)).toEqual({ xL: 0, xU: 1 });
  });

  it('falls back to a fixed placeholder range when every x is undefined', () => {
    const data = [{ y: 1 }, { y: 2 }];
    expect(resolveXExtent(data, (d) => d.x)).toEqual({ xL: 0, xU: 1 });
  });
});

describe('resolveYExtent (N2: the y half of the same degenerate case)', () => {
  it('pads the real min/max by the given factor', () => {
    const data = [{ y: 0 }, { y: 10 }];
    expect(resolveYExtent(data, (d) => d.y, 0.1)).toEqual({ yL: -1, yU: 11 });
  });

  it('falls back to a placeholder range for empty data instead of NaN', () => {
    expect(resolveYExtent([], (d) => d.y, 0.125)).toEqual({ yL: 0, yU: 1 });
  });

  it('falls back to a placeholder range when every y is undefined', () => {
    expect(resolveYExtent([{ x: 1 }, { x: 2 }], (d) => d.y, 0.125)).toEqual({ yL: 0, yU: 1 });
  });
});

describe('LineFocus/MultiFocus.setConfig with empty data (N2 regression)', () => {
  it('LineFocus falls back to a placeholder xExtent instead of NaN when data is empty', () => {
    const lineFocus = Object.create(LineFocus.prototype);
    lineFocus.data = [];
    lineFocus.factor = 0.125;
    lineFocus.scales = {
      x: { domain: jest.fn() },
      y: { domain: jest.fn() },
    };
    lineFocus.axisCall = { x: { scale: jest.fn() }, y: { scale: jest.fn() } };

    lineFocus.setConfig(false);

    expect(lineFocus.currentExtent.xExtent).toEqual({ xL: 0, xU: 1 });
    expect(lineFocus.scales.x.domain).toHaveBeenCalledWith([0, 1]);
    expect(lineFocus.scales.x.domain.mock.calls[0][0].some(Number.isNaN)).toBe(false);
    expect(lineFocus.scales.y.domain.mock.calls[0][0].some(Number.isNaN)).toBe(false);
  });

  it('MultiFocus falls back to a placeholder xExtent instead of NaN when data is empty', () => {
    const multiFocus = Object.create(MultiFocus.prototype);
    multiFocus.data = [];
    multiFocus.otherLineData = [];
    multiFocus.factor = 0.125;
    multiFocus.scales = {
      x: { domain: jest.fn() },
      y: { domain: jest.fn() },
    };
    multiFocus.axisCall = { x: { scale: jest.fn() }, y: { scale: jest.fn() } };

    multiFocus.setConfig(false);

    expect(multiFocus.currentExtent.xExtent).toEqual({ xL: 0, xU: 1 });
    expect(multiFocus.scales.x.domain).toHaveBeenCalledWith([0, 1]);
    expect(multiFocus.scales.x.domain.mock.calls[0][0].some(Number.isNaN)).toBe(false);
    expect(multiFocus.scales.y.domain.mock.calls[0][0].some(Number.isNaN)).toBe(false);
  });

  // Review finding S9: rect_focus.js (the m/z pane, same directory as
  // line_focus.js/multi_focus.js) had the identical d3.extent(...).sort(...)
  // pattern in setConfig, plus a second, unguarded d3.extent(...) in
  // setDataParams — the only domain set at all when this.data is empty, since
  // setConfig only runs once this.data.length > 0.
  it('RectFocus.setConfig falls back to a placeholder xExtent instead of NaN when data is empty', () => {
    const rectFocus = Object.create(RectFocus.prototype);
    rectFocus.data = [];
    rectFocus.factor = 0.125;
    rectFocus.scales = {
      x: { domain: jest.fn() },
      y: { domain: jest.fn() },
    };
    rectFocus.axisCall = { x: { scale: jest.fn() }, y: { scale: jest.fn() } };

    rectFocus.setConfig(false);

    expect(rectFocus.scales.x.domain.mock.calls[0][0].some(Number.isNaN)).toBe(false);
    expect(rectFocus.scales.y.domain.mock.calls[0][0].some(Number.isNaN)).toBe(false);
  });

  it('RectFocus.setDataParams falls back to a placeholder x domain instead of NaN when data is empty', () => {
    const rectFocus = Object.create(RectFocus.prototype);
    rectFocus.layout = null;
    rectFocus.scales = { x: { domain: jest.fn() } };

    rectFocus.setDataParams([], [], [], []);

    expect(rectFocus.scales.x.domain).toHaveBeenCalledWith([0, 1]);
  });
});

// Review finding S4: rather than each D3 focus class independently tracking the
// other pane's data (siblingSeed), the union x-domain is computed once here and
// seeded into Redux (seedLcmsUnionExtentAct), reusing the existing lcmsSyncX
// mirroring in updateZoom (reducer_ui.js) as the single source of truth for
// both panes' shared x-extent.
describe('computeLcmsUnionXExtent', () => {
  const layoutSt = LIST_LAYOUT.LC_MS;

  it('returns null when the TIC side has no data yet, instead of a partial union', () => {
    const uvvisSeed = [{ x: 1, y: 10 }, { x: 2, y: 20 }];
    expect(computeLcmsUnionXExtent(layoutSt, uvvisSeed, [])).toBeNull();
  });

  it('returns null when the UVVIS side has no data yet, instead of a partial union', () => {
    const topic = { x: [1, 2, 3], y: [10, 20, 30] };
    const feature = { maxY: 30 };
    expect(computeLcmsUnionXExtent(layoutSt, [], [{ topic, feature }])).toBeNull();
  });

  // Mirrors MultiFocus.setDataParams' own `if (!feature || !topic) return;`
  // guard: an entity MultiFocus itself would skip must not still widen the
  // seeded union, or the two panes would disagree by construction.
  it('ignores a TIC entity with a topic but no feature, exactly like MultiFocus would', () => {
    const uvvisSeed = [{ x: 1, y: 10 }, { x: 2, y: 20 }];
    const noFeatureEntity = { topic: { x: [100, 200], y: [1, 2] }, feature: null };
    expect(computeLcmsUnionXExtent(layoutSt, uvvisSeed, [noFeatureEntity])).toBeNull();
  });

  it('ignores a TIC entity with a feature but no topic', () => {
    const uvvisSeed = [{ x: 1, y: 10 }, { x: 2, y: 20 }];
    const noTopicEntity = { topic: null, feature: { maxY: 30 } };
    expect(computeLcmsUnionXExtent(layoutSt, uvvisSeed, [noTopicEntity])).toBeNull();
  });

  it('unions a valid TIC entity (via convertTopic) with the UVVIS seed', () => {
    const uvvisSeed = [{ x: 0.5, y: 5 }, { x: 4, y: 8 }];
    const topic = { x: [1, 2, 3], y: [10, 20, 30] };
    const feature = { maxY: 30 };
    expect(computeLcmsUnionXExtent(layoutSt, uvvisSeed, [{ topic, feature }]))
      .toEqual({ xL: 0.5, xU: 4 });
  });

  it('a feature-less TIC entity contributes nothing while a valid sibling still does', () => {
    const uvvisSeed = [{ x: 0, y: 1 }];
    const topic = { x: [5, 6], y: [50, 60] };
    const feature = { maxY: 60 };
    const validEntity = { topic, feature };
    const invalidEntity = { topic: { x: [100, 200], y: [1, 2] }, feature: null };

    expect(computeLcmsUnionXExtent(layoutSt, uvvisSeed, [validEntity, invalidEntity]))
      .toEqual({ xL: 0, xU: 6 });
  });

  // Regression for #619: the chemstation TIC and UVVIS fixtures are a real-world
  // example of the two LC-MS panes having mismatched native time ranges (TIC stops
  // at ~14 min, UVVIS runs to ~20 min). The seeded union must span both, not clip
  // to whichever pane's own data happens to be shorter.
  // A single non-finite x must not poison the union: it would be stored as a
  // truthy { xL: NaN } extent, the seed guard would then refuse to recompute,
  // and both panes would sit on domain([NaN, NaN]) until a manual zoom reset.
  // convertTopic produces exactly that whenever topic.y outruns topic.x.
  it('ignores non-finite x values on the UVVIS side rather than returning NaN', () => {
    const uvvisSeed = [{ x: NaN, y: 1 }, { x: 0.5, y: 5 }, { x: 4, y: 8 }];
    const topic = { x: [1, 2, 3], y: [10, 20, 30] };
    const feature = { maxY: 30 };
    expect(computeLcmsUnionXExtent(layoutSt, uvvisSeed, [{ topic, feature }]))
      .toEqual({ xL: 0.5, xU: 4 });
  });

  it('ignores a TIC topic whose y outruns its x rather than returning NaN', () => {
    const uvvisSeed = [{ x: 0.5, y: 5 }, { x: 4, y: 8 }];
    const topic = { x: [1, 2], y: [10, 20, 30] };
    const feature = { maxY: 30 };
    const union = computeLcmsUnionXExtent(layoutSt, uvvisSeed, [{ topic, feature }]);
    expect(Number.isFinite(union.xL)).toBe(true);
    expect(Number.isFinite(union.xU)).toBe(true);
    expect(union).toEqual({ xL: 0.5, xU: 4 });
  });

  it('returns null when every UVVIS x is non-finite, rather than a NaN extent', () => {
    const topic = { x: [1, 2, 3], y: [10, 20, 30] };
    const feature = { maxY: 30 };
    expect(computeLcmsUnionXExtent(layoutSt, [{ x: NaN, y: 1 }], [{ topic, feature }]))
      .toBeNull();
  });

  it('spans the real chemstation TIC (~14 min) and UVVIS (~20 min) mismatched ranges', () => {
    const ticEntity = ExtractJcamp(lcMsTicChemstationJcamp);
    const uvvisEntity = ExtractJcamp(lcMsUvvisChemstationJcamp);
    const { topic: ticTopic } = extractParams(ticEntity, null, null);
    const uvvisData = uvvisEntity.features[0].data[0];

    expect(ticTopic.x[ticTopic.x.length - 1]).toBeCloseTo(13.98, 1);
    expect(uvvisData.x[uvvisData.x.length - 1]).toBeCloseTo(19.96, 1);

    const uvvisSeed = toSeed(uvvisData.x, uvvisData.y);
    const ticEntityWithTopic = { topic: ticTopic, feature: { maxY: 1 } };
    const union = computeLcmsUnionXExtent(layoutSt, uvvisSeed, [ticEntityWithTopic]);

    // UVVIS starts slightly before zero (-0.0435) and TIC starts at ~1.12 — the
    // union's lower bound is whichever is smaller (UVVIS), its upper bound
    // whichever is larger (UVVIS's ~19.96, well past TIC's ~13.98).
    expect(union.xL).toBeCloseTo(uvvisData.x[0], 1);
    expect(union.xU).toBeCloseTo(19.96, 1);
  });
});

describe('ViewerLineRect.maybeSeedUnionXExtent', () => {
  const layoutSt = LIST_LAYOUT.LC_MS;
  const uvvisSeed = [{ x: 1, y: 10 }, { x: 2, y: 20 }];
  const topic = { x: [1, 2, 3], y: [10, 20, 30] };
  const feature = { maxY: 30 };
  const ticEntities = [{ topic, feature }];

  const buildInstance = (sweepExtent, lastSeededXExtent = null) => {
    const instance = Object.create(UnconnectedViewerLineRect.prototype);
    instance.props = {
      uiSt: { zoom: { sweepExtent } },
      seedLcmsUnionExtentAct: jest.fn(),
    };
    instance.lastSeededXExtent = lastSeededXExtent;
    return instance;
  };

  it('seeds the union when both panes are still unset, and returns it', () => {
    const instance = buildInstance([
      { xExtent: false, yExtent: false },
      { xExtent: false, yExtent: false },
    ]);

    const returned = instance.maybeSeedUnionXExtent(layoutSt, uvvisSeed, ticEntities);

    const expected = computeLcmsUnionXExtent(layoutSt, uvvisSeed, ticEntities);
    expect(instance.props.seedLcmsUnionExtentAct).toHaveBeenCalledTimes(1);
    expect(instance.props.seedLcmsUnionExtentAct).toHaveBeenCalledWith(expected);
    expect(instance.lastSeededXExtent).toEqual(expected);
    // Review finding S12: the caller needs this return value to use the freshly
    // seeded extent for the *current* render's create()/update() calls,
    // rather than the still-stale (pre-dispatch) sweepExtent from props.
    expect(returned).toEqual(expected);
  });

  it('returns null (nothing to apply this render) when it does not seed', () => {
    const instance = buildInstance([
      { xExtent: { xL: 0, xU: 1 }, yExtent: false },
      { xExtent: false, yExtent: false },
    ]);

    expect(instance.maybeSeedUnionXExtent(layoutSt, uvvisSeed, ticEntities)).toBeNull();
  });

  it('does not seed when an xExtent is present and does not match our last seed (a real user zoom)', () => {
    const instance = buildInstance([
      { xExtent: { xL: 0, xU: 1 }, yExtent: false },
      { xExtent: false, yExtent: false },
    ]);

    instance.maybeSeedUnionXExtent(layoutSt, uvvisSeed, ticEntities);

    expect(instance.props.seedLcmsUnionExtentAct).not.toHaveBeenCalled();
  });

  // Review finding S6: before this, an xExtent already present on either pane
  // blocked recomputation forever, so a TIC polarity switch (a different
  // retention-time range, with sweepExtent left untouched) kept the
  // first-seeded domain. lastSeededXExtent lets maybeSeedUnionXExtent tell
  // "still our own seed" from "the user zoomed" and keep tracking the data
  // in the former case.
  it('re-seeds with a new union when the data changed but the pane still holds our own last seed (S6)', () => {
    const firstUnion = computeLcmsUnionXExtent(layoutSt, uvvisSeed, ticEntities);
    const instance = buildInstance([
      { xExtent: firstUnion, yExtent: false },
      { xExtent: firstUnion, yExtent: false },
    ], firstUnion);

    // simulate a TIC polarity switch: a different curve, different RT range
    const switchedTicEntities = [{
      topic: { x: [50, 60], y: [1, 2] },
      feature: { maxY: 2 },
    }];

    instance.maybeSeedUnionXExtent(layoutSt, uvvisSeed, switchedTicEntities);

    const expected = computeLcmsUnionXExtent(layoutSt, uvvisSeed, switchedTicEntities);
    expect(expected).not.toEqual(firstUnion);
    expect(instance.props.seedLcmsUnionExtentAct).toHaveBeenCalledTimes(1);
    expect(instance.props.seedLcmsUnionExtentAct).toHaveBeenCalledWith(expected);
    expect(instance.lastSeededXExtent).toEqual(expected);
  });

  it('does not re-seed when the data is unchanged and the pane still holds our own last seed', () => {
    const firstUnion = computeLcmsUnionXExtent(layoutSt, uvvisSeed, ticEntities);
    const instance = buildInstance([
      { xExtent: firstUnion, yExtent: false },
      { xExtent: firstUnion, yExtent: false },
    ], firstUnion);

    instance.maybeSeedUnionXExtent(layoutSt, uvvisSeed, ticEntities);

    expect(instance.props.seedLcmsUnionExtentAct).not.toHaveBeenCalled();
  });

  it('never re-seeds once the pane holds a real zoom, even if the underlying data later changes', () => {
    const firstUnion = computeLcmsUnionXExtent(layoutSt, uvvisSeed, ticEntities);
    // the user zoomed graph 1 to something that is not our last seed
    const instance = buildInstance([
      { xExtent: firstUnion, yExtent: false },
      { xExtent: { xL: 1.4, xU: 1.6 }, yExtent: { yL: 0, yU: 1 } },
    ], firstUnion);

    const switchedTicEntities = [{
      topic: { x: [50, 60], y: [1, 2] },
      feature: { maxY: 2 },
    }];
    instance.maybeSeedUnionXExtent(layoutSt, uvvisSeed, switchedTicEntities);

    expect(instance.props.seedLcmsUnionExtentAct).not.toHaveBeenCalled();
  });

  it('does not seed a partial union while one side has no data yet', () => {
    const instance = buildInstance([
      { xExtent: false, yExtent: false },
      { xExtent: false, yExtent: false },
    ]);

    instance.maybeSeedUnionXExtent(layoutSt, [], ticEntities);

    expect(instance.props.seedLcmsUnionExtentAct).not.toHaveBeenCalled();
  });

  it('does nothing when sweepExtent is not yet an array', () => {
    const instance = buildInstance(undefined);

    expect(() => (
      instance.maybeSeedUnionXExtent(layoutSt, uvvisSeed, ticEntities)
    )).not.toThrow();
    expect(instance.props.seedLcmsUnionExtentAct).not.toHaveBeenCalled();
  });
});

// Review finding S5: computeLcmsUnionXExtent and maybeSeedUnionXExtent are unit
// tested directly above, but nothing proves componentDidMount/componentDidUpdate
// actually derive uvvisSeed/ticEntities from real props and call
// maybeSeedUnionXExtent with them — delete either call site and every test
// above would still pass. These invoke the real (unmocked) lifecycle methods
// on a plain instance to close that gap; only the DOM-drawing helpers and the
// three D3 focus objects are stubbed.
describe('ViewerLineRect componentDidMount/componentDidUpdate wiring (S5)', () => {
  const layoutSt = LIST_LAYOUT.LC_MS;
  const ticEntities = [{
    topic: { x: [0, 5], y: [1, 2] },
    feature: { maxY: 2 },
  }];
  const uvvisEntities = [{
    layout: LIST_LAYOUT.LC_MS,
    features: [{ data: [{ x: [1, 2], y: [10, 20] }] }],
  }];
  // The union of uvvisEntities' x=[1,2] and ticEntities' convertTopic-mapped x=[0,5].
  const expectedUnion = { xL: 0, xU: 5 };

  const buildProps = (sweepExtent) => ({
    layoutSt,
    curveSt: {},
    feature: {},
    ticEntities,
    uvvisEntities,
    mzEntities: [],
    hplcMsSt: {
      uvvis: { wavelengthIdx: 0 },
      tic: { polarity: 'positive' },
    },
    tTrEndPts: [],
    isUiAddIntgSt: false,
    isUiNoBrushSt: false,
    integrationSt: {},
    isHidden: false,
    editPeakSt: {},
    resetAllAct: jest.fn(),
    seedLcmsUnionExtentAct: jest.fn(),
    uiSt: {
      zoom: { sweepExtent },
      subViewerAt: null,
    },
  });

  const buildInstance = (sweepExtent) => {
    const instance = Object.create(UnconnectedViewerLineRect.prototype);
    instance.props = buildProps(sweepExtent);
    instance.rootKlassLine = '.line';
    instance.rootKlassMulti = '.multi';
    instance.rootKlassRect = '.rect';
    // Object.create skips the constructor, so establish the invariants it would have:
    // currentSizes is set there alongside the focus objects, and the re-create paths in
    // componentDidUpdate read it. mountCharts (componentDidMount) recomputes it via the
    // three ContainerSize instances below -- a null getNode (nothing rendered in this
    // Object.create-built instance) makes each one fall back to this same fallback size.
    const fallback = { width: 800, height: 260 };
    instance.currentSizes = { line: fallback, multi: fallback, rect: fallback };
    const nullGetNode = () => null;
    instance.lineSize = new ContainerSize(nullGetNode, fallback, () => {});
    instance.multiSize = new ContainerSize(nullGetNode, fallback, () => {});
    instance.rectSize = new ContainerSize(nullGetNode, fallback, () => {});
    const stubFocuses = () => {
      instance.lineFocus = { create: jest.fn(), update: jest.fn() };
      instance.multiFocus = { create: jest.fn(), update: jest.fn() };
      instance.rectFocus = { create: jest.fn(), update: jest.fn() };
    };
    stubFocuses();
    // mountCharts rebuilds the three focus objects every time it runs (it has to - a
    // resize remount gives them new pane sizes), so stubbing them once would let the real
    // D3 classes replace the stubs mid-lifecycle. Install them from createFocuses instead,
    // which keeps this test stubbing exactly what it says it stubs.
    instance.createFocuses = stubFocuses;
    return instance;
  };

  const unsetSweepExtent = () => ([
    { xExtent: false, yExtent: false },
    { xExtent: false, yExtent: false },
    { xExtent: false, yExtent: false },
  ]);

  it('componentDidMount seeds the real, props-derived union', () => {
    const instance = buildInstance(unsetSweepExtent());

    instance.componentDidMount();

    expect(instance.props.seedLcmsUnionExtentAct).toHaveBeenCalledTimes(1);
    expect(instance.props.seedLcmsUnionExtentAct).toHaveBeenCalledWith(expectedUnion);
    expect(instance.lineFocus.create).toHaveBeenCalledTimes(1);
    expect(instance.multiFocus.create).toHaveBeenCalledTimes(1);
  });

  // Review finding S12: dispatching the seed doesn't update this.props until
  // the next render, so building create()'s sweepExtentSt from the still-stale
  // (pre-dispatch) sweepExtent[0]/[1] — both still { xExtent: false } — would
  // make each pane auto-fit to only its own data for one visible frame before
  // the follow-up componentDidUpdate corrects them to the union.
  it('componentDidMount passes the freshly seeded extent into both create() calls in the same render, not a stale false', () => {
    const instance = buildInstance(unsetSweepExtent());

    instance.componentDidMount();

    const lineSweepExtentSt = instance.lineFocus.create.mock.calls[0][0].sweepExtentSt;
    const multiSweepExtentSt = instance.multiFocus.create.mock.calls[0][0].sweepExtentSt;
    expect(lineSweepExtentSt.xExtent).toEqual(expectedUnion);
    expect(multiSweepExtentSt.xExtent).toEqual(expectedUnion);
  });

  it('componentDidMount does not seed once a real zoom/seed already set an xExtent', () => {
    const sweepExtent = unsetSweepExtent();
    sweepExtent[0] = { xExtent: { xL: 0, xU: 1 }, yExtent: false };
    const instance = buildInstance(sweepExtent);

    instance.componentDidMount();

    expect(instance.props.seedLcmsUnionExtentAct).not.toHaveBeenCalled();
  });

  it('componentDidUpdate re-seeds after a real reset (both graphs back to false)', () => {
    const instance = buildInstance(unsetSweepExtent());

    instance.componentDidUpdate(instance.props);

    expect(instance.props.seedLcmsUnionExtentAct).toHaveBeenCalledTimes(1);
    expect(instance.props.seedLcmsUnionExtentAct).toHaveBeenCalledWith(expectedUnion);
    expect(instance.lineFocus.update).toHaveBeenCalledTimes(1);
    expect(instance.multiFocus.update).toHaveBeenCalledTimes(1);
  });

  it('componentDidUpdate passes the freshly seeded extent into both update() calls in the same render, not a stale false', () => {
    const instance = buildInstance(unsetSweepExtent());

    instance.componentDidUpdate(instance.props);

    const lineSweepExtentSt = instance.lineFocus.update.mock.calls[0][0].sweepExtentSt;
    const multiSweepExtentSt = instance.multiFocus.update.mock.calls[0][0].sweepExtentSt;
    expect(lineSweepExtentSt.xExtent).toEqual(expectedUnion);
    expect(multiSweepExtentSt.xExtent).toEqual(expectedUnion);
  });

  it('componentDidUpdate does not re-seed once one graph already has an xExtent', () => {
    const sweepExtent = unsetSweepExtent();
    sweepExtent[1] = { xExtent: { xL: 2, xU: 9 }, yExtent: false };
    const instance = buildInstance(sweepExtent);

    instance.componentDidUpdate(instance.props);

    expect(instance.props.seedLcmsUnionExtentAct).not.toHaveBeenCalled();
  });
});

// Review finding S7 (PR #336): each pane's height used to be read live off its own
// clientHeight unconditionally (measurePane), which is circular against an unbounded
// host (nothing bounds .rse-lcms-stack or its panes to a height that does not depend
// on their own content) -- the previous draw's own height feeds the next measurement,
// growing without bound. Now backed by one ContainerSize per pane (helpers/
// container_size.js, from #335): on an unbounded pane (clientHeight 0 once its content
// is removed, same as an empty container in a real unbounded browser layout) the
// target height is derived from the measured *width* and a fixed fallback aspect
// instead of ever being read back from the pane's own clientHeight, so there is
// nothing for a growth loop to feed on. mountCharts's drawMain calls are inspected
// directly (drawMain is mocked at the top of this file) rather than a real svg's
// viewBox, consistent with the rest of this file's UnconnectedViewerLineRect tests.
describe('ViewerLineRect pane sizing (S7)', () => {
  // Mirrors d3_line_rect/index.js's own fallback (not exported) so the fallback-aspect
  // math below can be checked without duplicating a magic number.
  const W = Math.round(window.innerWidth * 0.90 * 9 / 12);
  const H = Math.round(window.innerHeight * 0.90 * 0.8 / 3);

  const buildInstance = (paneClientHeight) => {
    const instance = Object.create(UnconnectedViewerLineRect.prototype);
    instance.props = {
      layoutSt: LIST_LAYOUT.LC_MS,
      curveSt: {},
      feature: {},
      ticEntities: [],
      uvvisEntities: [],
      mzEntities: [],
      hplcMsSt: { uvvis: { wavelengthIdx: 0 }, tic: { polarity: 'positive' } },
      tTrEndPts: [],
      isUiAddIntgSt: false,
      isUiNoBrushSt: false,
      integrationSt: {},
      isHidden: false,
      editPeakSt: {},
      resetAllAct: jest.fn(),
      seedLcmsUnionExtentAct: jest.fn(),
      uiSt: { zoom: { sweepExtent: [{ xExtent: false }, { xExtent: false }, { xExtent: false }] } },
    };
    instance.rootKlassLine = '.d3Line';
    instance.rootKlassMulti = '.d3Multi';
    instance.rootKlassRect = '.d3Rect';
    // A plain stub, not a real DOM node: clientWidth/clientHeight are all
    // ContainerSize reads off it.
    instance.lineRef = { current: { clientWidth: 1000, clientHeight: paneClientHeight } };
    instance.multiRef = { current: { clientWidth: 1000, clientHeight: paneClientHeight } };
    instance.rectRef = { current: { clientWidth: 1000, clientHeight: paneClientHeight } };
    instance.handleResize = () => {};
    const fallback = { width: W, height: H };
    instance.lineSize = new ContainerSize(() => instance.lineRef.current, fallback, instance.handleResize);
    instance.multiSize = new ContainerSize(() => instance.multiRef.current, fallback, instance.handleResize);
    instance.rectSize = new ContainerSize(() => instance.rectRef.current, fallback, instance.handleResize);
    instance.createFocuses = () => {
      instance.lineFocus = { create: jest.fn(), update: jest.fn() };
      instance.multiFocus = { create: jest.fn(), update: jest.fn() };
      instance.rectFocus = { create: jest.fn(), update: jest.fn() };
    };
    return instance;
  };

  const sizeArgsFor = (rootKlass) => {
    const call = drawMain.mock.calls.find((args) => args[0] === rootKlass);
    return { width: call[1], height: call[2] };
  };

  beforeEach(() => drawMain.mockClear());

  it('draws every pane at its own bounded height', () => {
    const instance = buildInstance(500);
    instance.componentDidMount();

    expect(sizeArgsFor('.d3Line')).toEqual({ width: 1000, height: 500 });
    expect(sizeArgsFor('.d3Multi')).toEqual({ width: 1000, height: 500 });
    expect(sizeArgsFor('.d3Rect')).toEqual({ width: 1000, height: 500 });
  });

  it('derives an unbounded pane height from its width and the fallback aspect, not its own clientHeight', () => {
    const instance = buildInstance(0);
    instance.componentDidMount();

    const expectedHeight = Math.max(Math.round((1000 * H) / W), 96);
    expect(sizeArgsFor('.d3Line')).toEqual({ width: 1000, height: expectedHeight });
    expect(sizeArgsFor('.d3Multi')).toEqual({ width: 1000, height: expectedHeight });
    expect(sizeArgsFor('.d3Rect')).toEqual({ width: 1000, height: expectedHeight });
    // Not what a live (and, against an unbounded host, circular) clientHeight
    // read of 0 would have produced.
    expect(expectedHeight).toBeGreaterThan(0);
  });
});
