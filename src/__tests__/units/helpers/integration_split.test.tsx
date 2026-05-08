import {
  NMR_SPLIT_PREVIEW_EXTENT,
  getIntegrationBounds,
  getIntegrationSplitTarget,
  interpolateY,
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

  it('uses fixed NMR preview bounds and rejects edge positions', () => {
    const focus = { scales: { y: (value: number) => value }, data };
    const target = { xL: 0, xU: 6 };

    expect(resolveSplitPreviewExtent(focus, target, 3, 0, false)).toEqual(NMR_SPLIT_PREVIEW_EXTENT);
    expect(resolveSplitPreviewExtent(focus, target, 0, 0, false)).toBeNull();
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
});
