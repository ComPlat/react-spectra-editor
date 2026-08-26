import {
  isLcmsMsPageLoading, measurePane, sameSizes,
  UnconnectedViewerLineRect, computeLcmsUnionXExtent, toSeed,
} from '../../../components/d3_line_rect/index';
import LineFocus from '../../../components/d3_line_rect/line_focus';
import MultiFocus, { pickTicIndex } from '../../../components/d3_line_rect/multi_focus';
import RectFocus from '../../../components/d3_line_rect/rect_focus';
import { resolveXExtent, resolveYExtent } from '../../../components/d3_line_rect/resolve_extent';
import { ExtractJcamp, convertTopic } from '../../../helpers/chem';
import { extractParams } from '../../../helpers/extractParams';
import { LIST_LAYOUT } from '../../../constants/list_layout';
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

  it('detects a real change in any single pane', () => {
    const a = sizes(1296, 197);
    const b = sizes(1296, 197);
    b.rect = { width: 1296, height: 260 };
    expect(sameSizes(a, b)).toBe(false);
  });

  it('absorbs a one-pixel difference, which is round-trip noise rather than a resize', () => {
    // A content-height pane takes its height from the svg, whose height comes back from
    // the viewBox this measurement sets. Treating a 1px integer-rounding difference as a
    // resize would remount forever.
    const a = sizes(1296, 197);
    const b = sizes(1297, 198);
    expect(sameSizes(a, b)).toBe(true);
  });
});

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

  it('seeds the union when both panes are still unset', () => {
    const instance = buildInstance([
      { xExtent: false, yExtent: false },
      { xExtent: false, yExtent: false },
    ]);

    instance.maybeSeedUnionXExtent(layoutSt, uvvisSeed, ticEntities);

    const expected = computeLcmsUnionXExtent(layoutSt, uvvisSeed, ticEntities);
    expect(instance.props.seedLcmsUnionExtentAct).toHaveBeenCalledTimes(1);
    expect(instance.props.seedLcmsUnionExtentAct).toHaveBeenCalledWith(expected);
    expect(instance.lastSeededXExtent).toEqual(expected);
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
    // componentDidUpdate read it.
    instance.currentSizes = {
      line: { width: 800, height: 260 },
      multi: { width: 800, height: 260 },
      rect: { width: 800, height: 260 },
    };
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

  it('componentDidUpdate does not re-seed once one graph already has an xExtent', () => {
    const sweepExtent = unsetSweepExtent();
    sweepExtent[1] = { xExtent: { xL: 2, xU: 9 }, yExtent: false };
    const instance = buildInstance(sweepExtent);

    instance.componentDidUpdate(instance.props);

    expect(instance.props.seedLcmsUnionExtentAct).not.toHaveBeenCalled();
  });
});
