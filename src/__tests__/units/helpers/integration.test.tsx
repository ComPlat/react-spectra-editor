import {
  buildSplitIntervals,
  calcArea,
  generateVisualSplitGroupId,
  getAbsoluteArea,
  getAbsoluteAreaWithBaseline,
  getArea,
  getIntegrationPoints,
  getLinearBaseline,
  getSplitAreas,
  getVisualSplitGroupBoundaries,
  getVisualSplitGroups,
  normalizeSplitLines,
  splitAreaProportionally,
} from "../../../helpers/integration";

describe('Test helper for integration', () => {
  describe('Test get area', () => {
    it('Do not have area', () => {
      const area = getArea(0, 1, [{x: 0, k: 0}, {x: 1, k: 0}])
      expect(area).toEqual(0.0)
    })

    it('Have area', () => {
      const area = getArea(0, 1, [{x: 0, k: 0}, {x: 1, k: 1}])
      expect(area).toEqual(1.0)
    })
  })

  describe('Test get absolute area', () => {
    it('Do not have area', () => {
      const area = getAbsoluteArea(0, 1, [{k: 1}, {k: 1}])
      expect(area).toEqual(0)
    })

    it('Have area', () => {
      const area = getAbsoluteArea(0, 3, [{x: 1.5, y: 1}, {x: 2, y: 2}, {x: 2.5, y: 2}])
      expect(area).toEqual(0.5)
    })
  })

  describe('Test AUC baseline', () => {
    it('starts the baseline at the first integration point, not at y=0', () => {
      const points = getIntegrationPoints(0, 3, [
        {x: 1, y: 10},
        {x: 2, y: 12},
      ]);
      const baselineY = getLinearBaseline(points);

      expect(baselineY(points[0])).toEqual(points[0].y);
      expect(baselineY(points[1])).toEqual(points[1].y);
    })

    it('uses a deterministic linear baseline for interior points', () => {
      const points = getIntegrationPoints(0, 4, [
        {x: 1, y: 10},
        {x: 2, y: 14},
        {x: 3, y: 12},
      ]);
      const baselineY = getLinearBaseline(points);

      expect(baselineY(points[1])).toEqual(11);
    })
  })

  describe('Test visual split areas', () => {
    const splitData = [
      {x: 1, y: 0, k: 1},
      {x: 2, y: 4, k: 2},
      {x: 3, y: 4, k: 3},
      {x: 4, y: 4, k: 4},
      {x: 5, y: 0, k: 5},
    ];

    it('builds sorted intervals from internal split lines only', () => {
      expect(buildSplitIntervals(0, 10, [8, -1, 4, 11])).toEqual([
        { xL: 0, xU: 4 },
        { xL: 4, xU: 8 },
        { xL: 8, xU: 10 },
      ]);
    })

    it('calculates split areas with the global integration baseline', () => {
      const mainPoints = getIntegrationPoints(0, 6, splitData);
      const baselineY = getLinearBaseline(mainPoints);

      expect(getAbsoluteAreaWithBaseline(2.5, 6, splitData, baselineY)).toEqual(4);
      expect(getSplitAreas(0, 6, [2.5], splitData)).toEqual([
        { xL: 0, xU: 2.5, area: 1, absoluteArea: 4 },
        { xL: 2.5, xU: 6, area: 2, absoluteArea: 4 },
      ]);
    })
  })

  describe('Test visual split groups', () => {
    it('returns no groups for an empty stack', () => {
      expect(getVisualSplitGroups([])).toEqual([])
      expect(getVisualSplitGroups(null as any)).toEqual([])
    })

    it('returns singleton groups for items without groupId', () => {
      const stack = [
        { xL: 0, xU: 4, area: 4, absoluteArea: 0 },
        { xL: 5, xU: 9, area: 4, absoluteArea: 0 },
      ]
      const groups = getVisualSplitGroups(stack)
      expect(groups).toHaveLength(2)
      expect(groups[0].isMerged).toBe(false)
      expect(groups[1].isMerged).toBe(false)
    })

    it('groups consecutive items sharing a visualSplitGroupId', () => {
      const stack = [
        { xL: 0, xU: 4, area: 4, absoluteArea: 0, visualSplitGroupId: 'g1' },
        { xL: 4, xU: 7, area: 3, absoluteArea: 0, visualSplitGroupId: 'g1' },
        { xL: 8, xU: 10, area: 2, absoluteArea: 0 },
      ]
      const groups = getVisualSplitGroups(stack)
      expect(groups).toHaveLength(2)
      expect(groups[0].items).toHaveLength(2)
      expect(groups[0].xL).toEqual(0)
      expect(groups[0].xU).toEqual(7)
      expect(groups[0].isMerged).toBe(true)
      expect(groups[1].isMerged).toBe(false)
    })

    it('treats non-consecutive items with the same id as separate groups', () => {
      const stack = [
        { xL: 0, xU: 3, area: 3, absoluteArea: 0, visualSplitGroupId: 'g1' },
        { xL: 4, xU: 6, area: 2, absoluteArea: 0 },
        { xL: 7, xU: 10, area: 3, absoluteArea: 0, visualSplitGroupId: 'g1' },
      ]
      const groups = getVisualSplitGroups(stack)
      expect(groups).toHaveLength(3)
      expect(groups[0].isMerged).toBe(false)
      expect(groups[2].isMerged).toBe(false)
    })

    it('returns the internal boundaries between merged items', () => {
      const stack = [
        { xL: 0, xU: 4, area: 4, absoluteArea: 0, visualSplitGroupId: 'g1' },
        { xL: 4, xU: 7, area: 3, absoluteArea: 0, visualSplitGroupId: 'g1' },
        { xL: 7, xU: 10, area: 3, absoluteArea: 0, visualSplitGroupId: 'g1' },
      ]
      const groups = getVisualSplitGroups(stack)
      expect(getVisualSplitGroupBoundaries(groups[0])).toEqual([4, 7])
    })

    it('returns no boundaries for non-merged groups', () => {
      const groups = getVisualSplitGroups([{ xL: 0, xU: 4, area: 4, absoluteArea: 0 }])
      expect(getVisualSplitGroupBoundaries(groups[0])).toEqual([])
    })
  })

  describe('Test generate visual split group id', () => {
    it('produces unique stable ids', () => {
      const a = generateVisualSplitGroupId()
      const b = generateVisualSplitGroupId()
      expect(typeof a).toBe('string')
      expect(a.startsWith('vsg-')).toBe(true)
      expect(a).not.toEqual(b)
    })
  })

  describe('Test normalize split lines', () => {
    it('returns an empty array when value is missing or invalid', () => {
      expect(normalizeSplitLines(undefined)).toEqual([])
      expect(normalizeSplitLines(null as any)).toEqual([])
      expect(normalizeSplitLines('foo' as any)).toEqual([])
      expect(normalizeSplitLines([NaN, undefined, null, 'x'] as any)).toEqual([])
    })

    it('keeps finite values, deduplicates them and returns ascending order', () => {
      expect(normalizeSplitLines([4, 2, 4, 1.5, NaN, '3' as any])).toEqual([1.5, 2, 3, 4])
    })
  })

  describe('Test split area proportionally', () => {
    it('preserves the original total exactly while keeping the data ratio', () => {
      const result = splitAreaProportionally(300, 200, 40)
      expect(result.left + result.right).toBeCloseTo(300, 9)
      expect(result.left / result.right).toBeCloseTo(200 / 40, 9)
    })

    it('returns zeros when the original total is zero', () => {
      expect(splitAreaProportionally(0, 10, 20)).toEqual({ left: 0, right: 0 })
    })

    it('splits evenly when the raw measurements cannot infer a proportion', () => {
      expect(splitAreaProportionally(8, 0, 0)).toEqual({ left: 4, right: 4 })
    })

    it('handles a single non-zero side by giving all the mass to it', () => {
      const result = splitAreaProportionally(10, 0, 4)
      expect(result.left).toEqual(0)
      expect(result.right).toEqual(10)
    })

    it('gracefully treats non finite inputs as zero', () => {
      expect(splitAreaProportionally(NaN as any, 1, 1)).toEqual({ left: 0, right: 0 })
      const result = splitAreaProportionally(10, NaN as any, 5)
      expect(result.left).toEqual(0)
      expect(result.right).toEqual(10)
    })
  })

  describe('Test calculate area', () => {
    it('Do not ignore ref', () => {
      const data = { area: 0.5 }
      const refFaktor = 0.5
      const refArea = 1.5
      const area = calcArea(data, refArea, refFaktor)
      expect(area).toEqual('0.17')
    })

    it('Ignore ref', () => {
      const data = { absoluteArea: 0.515469 }
      const refFaktor = 0.5
      const refArea = 1.5
      const area = calcArea(data, refArea, refFaktor, true)
      expect(area).toEqual('0.52')
    })
  })
})