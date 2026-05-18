import {
  NMR_SPLIT_PREVIEW_EXTENT,
  getIntegrationBounds,
  getIntegrationSplitTarget,
  getVisualSplitLineAtX,
  getVisualSplitLines,
  interpolateY,
  isAlreadyVisuallySplit,
  isMergedVisualSplitGroup,
  resolveSplitPreviewExtent,
} from "../../../helpers/integration_split";

describe('Test helper for integration split preview', () => {
  const data = [
    { x: 0, y: 0 },
    { x: 2, y: 4 },
    { x: 4, y: 2 },
    { x: 6, y: 0 },
  ];

  it('resolves shifted integration bounds in data coordinates', () => {
    expect(getIntegrationBounds({ xL: 1, xU: 7 }, 1)).toEqual([0, 6]);
  });

  it('finds a split target only when the x position is inside an integration', () => {
    const focus = {
      integrationSplitTargets: {
        stack: [{ xL: 0, xU: 3 }, { xL: 5, xU: 8 }],
        shift: 0,
      },
    };

    expect(getIntegrationSplitTarget(focus, 2)).toEqual({ xL: 0, xU: 3 });
    expect(getIntegrationSplitTarget(focus, 4)).toBeUndefined();
  });

  it('interpolates y values between neighbouring points', () => {
    expect(interpolateY(data, 3)).toEqual(3);
  });

  it('resolves visual split boundaries from the stack groups in data coordinates', () => {
    const stack = [
      { xL: 1, xU: 4, visualSplitGroupId: 'g1' },
      { xL: 4, xU: 6, visualSplitGroupId: 'g1' },
    ];
    expect(getVisualSplitLines(stack, 1)).toEqual([3]);
  });

  it('returns no visual split lines when no group is merged', () => {
    const stack = [
      { xL: 0, xU: 4 },
      { xL: 4, xU: 6 },
    ];
    expect(getVisualSplitLines(stack, 0)).toEqual([]);
  });

  it('finds an existing visual split line by screen tolerance', () => {
    const focus = {
      scales: { x: (value: number) => value * 10 },
    };
    const stack = [
      { xL: 0, xU: 3, visualSplitGroupId: 'g1' },
      { xL: 3, xU: 6, visualSplitGroupId: 'g1' },
    ];

    expect(getVisualSplitLineAtX(focus, stack, 3.4, 0, 5)).toEqual(3);
    expect(getVisualSplitLineAtX(focus, stack, 3.7, 0, 5)).toBeNull();
  });

  it('uses fixed NMR preview bounds and rejects edge positions', () => {
    const focus = { scales: { y: (value: number) => value }, data };
    const target = { xL: 0, xU: 6 };

    expect(resolveSplitPreviewExtent(focus, target, 3, 0, false)).toEqual(NMR_SPLIT_PREVIEW_EXTENT);
    expect(resolveSplitPreviewExtent(focus, target, 0, 0, false)).toBeNull();
  });

  describe('isAlreadyVisuallySplit', () => {
    it('returns false for a pristine integration that has never been split', () => {
      expect(isAlreadyVisuallySplit({ xL: 0, xU: 10 })).toBe(false);
    });

    it('returns true for a child stack item that carries a visualSplitGroupId', () => {
      expect(isAlreadyVisuallySplit({ xL: 0, xU: 4, visualSplitGroupId: 'g1' })).toBe(true);
    });

    it('returns true for a merged group container exposed to the UI', () => {
      expect(isAlreadyVisuallySplit({
        xL: 0, xU: 10, isMerged: true, groupId: 'g1',
      })).toBe(true);
    });

    it('returns false for a singleton group container', () => {
      expect(isAlreadyVisuallySplit({
        xL: 0, xU: 10, isMerged: false, groupId: null,
      })).toBe(false);
    });

    it('returns false for nullish or empty input', () => {
      expect(isAlreadyVisuallySplit(null as any)).toBe(false);
      expect(isAlreadyVisuallySplit(undefined as any)).toBe(false);
    });
  });

  describe('isMergedVisualSplitGroup', () => {
    it('returns true only for a merged group container', () => {
      expect(isMergedVisualSplitGroup({
        xL: 0, xU: 10, isMerged: true, groupId: 'g1',
      })).toBe(true);
    });

    it('returns false for a raw child stack item carrying a groupId', () => {
      expect(isMergedVisualSplitGroup({ xL: 0, xU: 4, visualSplitGroupId: 'g1' })).toBe(false);
    });

    it('returns false for a pristine integration and for nullish input', () => {
      expect(isMergedVisualSplitGroup({ xL: 0, xU: 10 })).toBe(false);
      expect(isMergedVisualSplitGroup(null as any)).toBe(false);
      expect(isMergedVisualSplitGroup(undefined as any)).toBe(false);
    });
  });

  it('resolves HPLC preview bounds between baseline and curve', () => {
    const focus = {
      scales: { y: (value: number) => value },
      data: [
        { x: 0, y: 0 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
        { x: 4, y: 4 },
        { x: 6, y: 0 },
      ],
    };

    const extent = resolveSplitPreviewExtent(focus, { xL: 0, xU: 6 }, 3, 0, true);

    expect(extent).toEqual({ y1: 4, y2: 6 });
  });

  it('uses the merged group bounds for the baseline when previewing on a visual split child', () => {
    const stack = [
      { xL: 0, xU: 3, visualSplitGroupId: 'g1' },
      { xL: 3, xU: 6, visualSplitGroupId: 'g1' },
    ];
    const focus: any = {
      scales: { y: (value: number) => value },
      data: [
        { x: 0, y: 0 },
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
        { x: 4, y: 4 },
        { x: 5, y: 2 },
        { x: 6, y: 0 },
      ],
      integrationSplitTargets: { stack, shift: 0, ignoreRef: true },
    };

    const childExtent = resolveSplitPreviewExtent(focus, stack[1], 4, 0, true);
    const groupExtent = resolveSplitPreviewExtent(
      focus,
      { xL: 0, xU: 6, isMerged: true },
      4,
      0,
      true,
    );

    expect(childExtent).toEqual(groupExtent);
    expect(childExtent).toEqual({ y1: 2, y2: 4 });
  });

  it('falls back to the local target bounds when no visual split context is available', () => {
    const focus: any = {
      scales: { y: (value: number) => value },
      data: [
        { x: 0, y: 10 },
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
        { x: 4, y: 4 },
        { x: 5, y: 2 },
        { x: 6, y: 10 },
      ],
    };

    const targetOnly = resolveSplitPreviewExtent(focus, { xL: 1, xU: 5 }, 3, 0, true);
    const fullData = resolveSplitPreviewExtent(focus, { xL: 0, xU: 6 }, 3, 0, true);

    expect(targetOnly).not.toBeNull();
    expect(fullData).not.toBeNull();
    expect(targetOnly).not.toEqual(fullData);
  });
});
