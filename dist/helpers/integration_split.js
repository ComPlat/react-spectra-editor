"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveSplitPreviewExtent = exports.isMergedVisualSplitGroup = exports.isAlreadyVisuallySplit = exports.interpolateY = exports.getVisualSplitLines = exports.getVisualSplitLineAtX = exports.getSplitXFromEvent = exports.getIntegrationSplitTargetFromEvent = exports.getIntegrationSplitTarget = exports.getIntegrationBounds = exports.drawIntegrationVisualSplitLines = exports.drawIntegrationSplitPreview = exports.clearIntegrationSplitPreview = exports.NMR_SPLIT_PREVIEW_EXTENT = void 0;
var _integration = require("./integration");
const d3 = require('d3');
const SPLIT_PREVIEW_CLASS = 'integration-split-preview-line';
const VISUAL_SPLIT_CLASS = 'integration-visual-split-line';
const VISUAL_SPLIT_HIT_TOLERANCE_PX = 6;
const NMR_SPLIT_PREVIEW_EXTENT = exports.NMR_SPLIT_PREVIEW_EXTENT = {
  y1: 38,
  y2: 55
};
const getIntegrationBounds = (target, shift = 0) => [target.xL - shift, target.xU - shift].sort((a, b) => a - b);
exports.getIntegrationBounds = getIntegrationBounds;
const getSplitXFromEvent = (event, focus) => {
  const rawMouseX = d3.pointer(event, focus.root.node())[0];
  return focus.scales.x.invert(rawMouseX);
};
exports.getSplitXFromEvent = getSplitXFromEvent;
const clearIntegrationSplitPreview = focus => {
  if (!focus || !focus.root) return;
  focus.root.select(`.${SPLIT_PREVIEW_CLASS}`).remove();
};
exports.clearIntegrationSplitPreview = clearIntegrationSplitPreview;
const isAlreadyVisuallySplit = target => {
  if (!target) return false;
  return !!target.visualSplitGroupId || target.isMerged === true;
};
exports.isAlreadyVisuallySplit = isAlreadyVisuallySplit;
const isMergedVisualSplitGroup = target => !!(target && target.isMerged === true);
exports.isMergedVisualSplitGroup = isMergedVisualSplitGroup;
const resolveBaselineContextBounds = (focus, target, shift) => {
  if (target && target.isMerged === true) {
    return getIntegrationBounds(target, shift);
  }
  const groupId = target && target.visualSplitGroupId;
  const stack = focus && focus.integrationSplitTargets && focus.integrationSplitTargets.stack;
  if (groupId && Array.isArray(stack)) {
    const siblings = stack.filter(item => item && item.visualSplitGroupId === groupId);
    if (siblings.length > 1) {
      const lower = Math.min(...siblings.map(item => item.xL)) - shift;
      const upper = Math.max(...siblings.map(item => item.xU)) - shift;
      return [lower, upper].sort((a, b) => a - b);
    }
  }
  return getIntegrationBounds(target, shift);
};
const getIntegrationSplitTarget = (focus, splitX) => {
  const splitTargets = focus && focus.integrationSplitTargets;
  if (!splitTargets || !Number.isFinite(splitX)) return null;
  const {
    stack = [],
    shift = 0
  } = splitTargets;
  return stack.find(target => {
    const [xL, xU] = getIntegrationBounds(target, shift);
    return splitX > xL && splitX < xU;
  });
};
exports.getIntegrationSplitTarget = getIntegrationSplitTarget;
const getIntegrationSplitTargetFromEvent = (event, focus) => {
  const splitX = getSplitXFromEvent(event, focus);
  const target = getIntegrationSplitTarget(focus, splitX);
  return {
    splitX,
    target
  };
};
exports.getIntegrationSplitTargetFromEvent = getIntegrationSplitTargetFromEvent;
const getVisualSplitLines = (stack = [], shift = 0) => {
  if (!Array.isArray(stack)) return [];
  return (0, _integration.getVisualSplitGroups)(stack).filter(group => group.isMerged).reduce((acc, group) => {
    (0, _integration.getVisualSplitGroupBoundaries)(group).forEach(boundary => {
      const value = boundary - shift;
      if (Number.isFinite(value)) acc.push(value);
    });
    return acc;
  }, []);
};
exports.getVisualSplitLines = getVisualSplitLines;
const getVisualSplitLineAtX = (focus, stack, splitX, shift = 0, pixelTolerance = VISUAL_SPLIT_HIT_TOLERANCE_PX) => {
  if (!focus || !focus.scales || !focus.scales.x || !Number.isFinite(splitX)) return null;
  const xt = focus.scales.x;
  const splitXPx = xt(splitX);
  const nearest = getVisualSplitLines(stack, shift).reduce((acc, lineX) => {
    const distance = Math.abs(xt(lineX) - splitXPx);
    if (!acc || distance < acc.distance) {
      return {
        splitX: lineX,
        distance
      };
    }
    return acc;
  }, null);
  return nearest && nearest.distance <= pixelTolerance ? nearest.splitX : null;
};
exports.getVisualSplitLineAtX = getVisualSplitLineAtX;
const interpolateY = (points, x) => {
  if (!points || points.length === 0) return null;
  const sortedPoints = [...points].sort((a, b) => a.x - b.x);
  const upperIndex = sortedPoints.findIndex(point => point.x >= x);
  if (upperIndex < 0) return sortedPoints[sortedPoints.length - 1].y;
  if (upperIndex === 0) return sortedPoints[0].y;
  const lowerPoint = sortedPoints[upperIndex - 1];
  const upperPoint = sortedPoints[upperIndex];
  const xDelta = upperPoint.x - lowerPoint.x;
  if (xDelta === 0) return lowerPoint.y;
  const ratio = (x - lowerPoint.x) / xDelta;
  return lowerPoint.y + ratio * (upperPoint.y - lowerPoint.y);
};
exports.interpolateY = interpolateY;
const resolveSplitPreviewExtent = (focus, target, splitX, shift, ignoreRef) => {
  if (!focus || !target || !focus.scales || !focus.scales.y) return null;
  const yt = focus.scales.y;
  const [xL, xU] = getIntegrationBounds(target, shift);
  if (!Number.isFinite(splitX) || splitX <= xL || splitX >= xU) return null;
  if (!ignoreRef) {
    return NMR_SPLIT_PREVIEW_EXTENT;
  }
  const [contextXL, contextXU] = resolveBaselineContextBounds(focus, target, shift);
  const points = (0, _integration.getIntegrationPoints)(contextXL, contextXU, focus.data);
  if (points.length < 2) return null;
  const baselineY = (0, _integration.getLinearBaseline)(points);
  const curveY = interpolateY(points, splitX);
  const baseY = baselineY({
    x: splitX
  });
  if (!Number.isFinite(curveY) || !Number.isFinite(baseY)) return null;
  return {
    y1: yt(baseY),
    y2: yt(curveY)
  };
};
exports.resolveSplitPreviewExtent = resolveSplitPreviewExtent;
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
  line.enter().append('line').attr('class', SPLIT_PREVIEW_CLASS).attr('stroke', 'red').attr('stroke-width', 2).attr('stroke-dasharray', '4,3').style('pointer-events', 'none').merge(line).attr('x1', x).attr('x2', x).attr('y1', d => d.y1).attr('y2', d => d.y2);
};
exports.drawIntegrationSplitPreview = drawIntegrationSplitPreview;
const drawIntegrationVisualSplitLines = (focus, stack = [], shift = 0, ignoreRef = false, isInteractive = false, onClickLine = null) => {
  if (!focus || !focus.tags || !focus.tags.visualSplitPath) return;
  const groups = (0, _integration.getVisualSplitGroups)(stack).filter(group => group.isMerged);
  const splitLines = groups.reduce((acc, group) => {
    const groupTarget = {
      xL: group.xL,
      xU: group.xU
    };
    (0, _integration.getVisualSplitGroupBoundaries)(group).forEach(boundary => {
      const splitX = boundary - shift;
      const extent = resolveSplitPreviewExtent(focus, groupTarget, splitX, shift, ignoreRef);
      if (extent) {
        acc.push({
          splitX,
          key: `${group.groupId || `${group.xL}-${group.xU}`}-${splitX}`,
          ...extent
        });
      }
    });
    return acc;
  }, []);
  const xt = focus.scales.x;
  const lines = focus.tags.visualSplitPath.selectAll(`line.${VISUAL_SPLIT_CLASS}`).data(splitLines, d => d.key);
  lines.exit().attr('class', 'exit').remove();
  lines.enter().append('line').attr('class', VISUAL_SPLIT_CLASS).attr('stroke', 'red').attr('stroke-width', 2).merge(lines).attr('x1', d => xt(d.splitX)).attr('x2', d => xt(d.splitX)).attr('y1', d => d.y1).attr('y2', d => d.y2).style('pointer-events', isInteractive ? 'stroke' : 'none').on('click', isInteractive && onClickLine ? (event, d) => onClickLine(event, d.splitX) : null);
};
exports.drawIntegrationVisualSplitLines = drawIntegrationVisualSplitLines;