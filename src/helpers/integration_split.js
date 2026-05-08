import { getIntegrationPoints, getLinearBaseline } from './integration';

const d3 = require('d3');

const SPLIT_PREVIEW_CLASS = 'integration-split-preview-line';
const NMR_SPLIT_PREVIEW_EXTENT = { y1: 38, y2: 55 };

const getIntegrationBounds = (target, shift = 0) => (
  [target.xL - shift, target.xU - shift].sort((a, b) => a - b)
);

const getSplitXFromEvent = (event, focus) => {
  const rawMouseX = d3.pointer(event, focus.root.node())[0];
  return focus.scales.x.invert(rawMouseX);
};

const clearIntegrationSplitPreview = (focus) => {
  if (!focus || !focus.root) return;
  focus.root.select(`.${SPLIT_PREVIEW_CLASS}`).remove();
};

const getIntegrationSplitTarget = (focus, splitX) => {
  const splitTargets = focus && focus.integrationSplitTargets;
  if (!splitTargets || !Number.isFinite(splitX)) return null;

  const { stack = [], shift = 0 } = splitTargets;
  return stack.find((target) => {
    const [xL, xU] = getIntegrationBounds(target, shift);
    return splitX > xL && splitX < xU;
  });
};

const getIntegrationSplitTargetFromEvent = (event, focus) => {
  const splitX = getSplitXFromEvent(event, focus);
  const target = getIntegrationSplitTarget(focus, splitX);

  return { splitX, target };
};

const interpolateY = (points, x) => {
  if (!points || points.length === 0) return null;
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);
  const upperIndex = sortedPoints.findIndex((point) => point.x >= x);
  if (upperIndex <= 0) return sortedPoints[0].y;
  if (upperIndex < 0) return sortedPoints[sortedPoints.length - 1].y;

  const lowerPoint = sortedPoints[upperIndex - 1];
  const upperPoint = sortedPoints[upperIndex];
  const xDelta = upperPoint.x - lowerPoint.x;
  if (xDelta === 0) return lowerPoint.y;

  const ratio = (x - lowerPoint.x) / xDelta;
  return lowerPoint.y + ratio * (upperPoint.y - lowerPoint.y);
};

const resolveSplitPreviewExtent = (focus, target, splitX, shift, ignoreRef) => {
  if (!focus || !target || !focus.scales || !focus.scales.y) return null;

  const yt = focus.scales.y;
  const [xL, xU] = getIntegrationBounds(target, shift);
  if (!Number.isFinite(splitX) || splitX <= xL || splitX >= xU) return null;

  if (!ignoreRef) {
    return NMR_SPLIT_PREVIEW_EXTENT;
  }

  const points = getIntegrationPoints(xL, xU, focus.data);
  if (points.length < 2) return null;

  const baselineY = getLinearBaseline(points);
  const curveY = interpolateY(points, splitX);
  if (!Number.isFinite(curveY)) return null;

  return {
    y1: yt(baselineY({ x: splitX })),
    y2: yt(curveY),
  };
};

const drawIntegrationSplitPreview = (focus, target, splitX, shift, ignoreRef) => {
  const extent = resolveSplitPreviewExtent(focus, target, splitX, shift, ignoreRef);
  if (!extent) {
    clearIntegrationSplitPreview(focus);
    return;
  }

  const xt = focus.scales.x;
  const x = xt(splitX);
  const preview = focus.root.select('.integration-preview');
  preview.raise();
  const line = preview.selectAll(`.${SPLIT_PREVIEW_CLASS}`).data([extent]);

  line.enter()
    .append('line')
    .attr('class', SPLIT_PREVIEW_CLASS)
    .attr('stroke', 'red')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '4,3')
    .style('pointer-events', 'none')
    .merge(line)
    .attr('x1', x)
    .attr('x2', x)
    .attr('y1', (d) => d.y1)
    .attr('y2', (d) => d.y2);
};

export {
  NMR_SPLIT_PREVIEW_EXTENT,
  clearIntegrationSplitPreview,
  drawIntegrationSplitPreview,
  getIntegrationBounds,
  getIntegrationSplitTarget,
  getIntegrationSplitTargetFromEvent,
  getSplitXFromEvent,
  interpolateY,
  resolveSplitPreviewExtent,
};
