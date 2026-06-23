/* eslint-disable no-mixed-operators */
import { calcSlope } from './calc';

const getArea = (xL, xU, data) => {
  if (!Array.isArray(data) || data.length === 0) return NaN;
  let [iL, iU] = [data.length - 1, 0];
  for (let i = 0; i < data.length; i += 1) {
    const pt = data[i];
    if (xL <= pt.x && pt.x <= xU) {
      if (iL > i) { iL = i; }
      if (i > iU) { iU = i; }
    }
  }
  return Math.abs(data[iU].k - data[iL].k);
};

const getIntegrationPoints = (xL, xU, data) => {
  if (!Array.isArray(data)) return [];
  return data.filter((d) => (
    d && Number.isFinite(d.x) && Number.isFinite(d.y) && d.x > xL && d.x < xU
  ));
};

const getLinearBaseline = (points) => {
  if (!points || !points[0]) return () => 0;
  const point1 = points[0];
  const point2 = points[points.length - 1];
  const slope = calcSlope(point1.x, point1.y, point2.x, point2.y);
  return (point) => point1.y + slope * (point.x - point1.x);
};

const normalizeSplitLines = (splitLines) => {
  if (!Array.isArray(splitLines)) return [];
  const finiteValues = splitLines
    .map((value) => parseFloat(value))
    .filter((value) => Number.isFinite(value));
  return [...new Set(finiteValues)].sort((a, b) => a - b);
};

const buildSplitIntervals = (xL, xU, splitLines = []) => {
  if (!Number.isFinite(xL) || !Number.isFinite(xU)) return [];

  const [lower, upper] = [xL, xU].sort((a, b) => a - b);
  if (lower === upper) return [];

  const sortedSplitLines = normalizeSplitLines(splitLines)
    .filter((splitX) => splitX > lower && splitX < upper);

  return [lower, ...sortedSplitLines, upper].slice(1).map((right, index, bounds) => ({
    xL: index === 0 ? lower : bounds[index - 1],
    xU: right,
  }));
};

const getAbsoluteAreaWithBaseline = (xL, xU, data, baselineY) => {
  const ps = getIntegrationPoints(xL, xU, data);
  if (ps.length < 2 || typeof baselineY !== 'function') return 0;

  let area = 0;
  for (let i = 1; i < ps.length; i += 1) {
    const pt = ps[i];
    const baselineValue = baselineY(pt);
    if (Number.isFinite(baselineValue)) {
      area += Math.abs(pt.y - baselineValue);
    }
  }
  return area;
};

const getAbsoluteArea = (xL, xU, data) => {
  const points = getIntegrationPoints(xL, xU, data);
  const baselineY = getLinearBaseline(points);
  return getAbsoluteAreaWithBaseline(xL, xU, data, baselineY);
};

const getSplitAreas = (xL, xU, splitLines, data) => {
  const intervals = buildSplitIntervals(xL, xU, splitLines);
  const mainPoints = getIntegrationPoints(xL, xU, data);
  const baselineY = getLinearBaseline(mainPoints);

  return intervals.map((interval) => ({
    xL: interval.xL,
    xU: interval.xU,
    area: getArea(interval.xL, interval.xU, data),
    absoluteArea: getAbsoluteAreaWithBaseline(interval.xL, interval.xU, data, baselineY),
  }));
};

const calcArea = (d, refArea, refFactor, ignoreRef = false) => {
  if (ignoreRef) {
    const { absoluteArea } = d;
    return !absoluteArea ? 0 : d.absoluteArea.toFixed(2);
  }
  return (d.area * refFactor / refArea).toFixed(2);
};

const splitAreaProportionally = (totalArea, leftRaw, rightRaw) => {
  const safeTotal = Number.isFinite(totalArea) ? totalArea : 0;
  if (safeTotal === 0) return { left: 0, right: 0 };

  const safeLeft = Number.isFinite(leftRaw) ? Math.max(leftRaw, 0) : 0;
  const safeRight = Number.isFinite(rightRaw) ? Math.max(rightRaw, 0) : 0;
  const rawSum = safeLeft + safeRight;
  if (rawSum <= 0) {
    const half = safeTotal / 2;
    return { left: half, right: half };
  }

  const ratio = safeTotal / rawSum;
  return { left: safeLeft * ratio, right: safeRight * ratio };
};

let visualSplitGroupCounter = 0;
const generateVisualSplitGroupId = () => {
  visualSplitGroupCounter += 1;
  const seed = (typeof Date !== 'undefined' && Date.now)
    ? Date.now().toString(36)
    : Math.random().toString(36).slice(2);
  return `vsg-${seed}-${visualSplitGroupCounter}`;
};

const getVisualSplitGroups = (stack = []) => {
  if (!Array.isArray(stack) || stack.length === 0) return [];
  const groups = [];
  let current = null;
  stack.forEach((item) => {
    const groupId = item && item.visualSplitGroupId;
    if (groupId && current && current.groupId === groupId) {
      current.items.push(item);
      current.xL = Math.min(current.xL, item.xL);
      current.xU = Math.max(current.xU, item.xU);
    } else {
      current = {
        groupId: groupId || null,
        items: [item],
        xL: item.xL,
        xU: item.xU,
        isMerged: false,
      };
      groups.push(current);
    }
  });
  groups.forEach((group) => {
    // eslint-disable-next-line no-param-reassign
    group.isMerged = !!group.groupId && group.items.length > 1;
  });
  return groups;
};

const getVisualSplitGroupBoundaries = (group) => {
  if (!group || !group.isMerged) return [];
  const sortedItems = [...group.items].sort((a, b) => a.xL - b.xL);
  const boundaries = [];
  for (let i = 0; i < sortedItems.length - 1; i += 1) {
    const current = sortedItems[i];
    const next = sortedItems[i + 1];
    const boundary = (current.xU + next.xL) / 2;
    if (Number.isFinite(boundary)) boundaries.push(boundary);
  }
  return boundaries;
};

export {
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
};  // eslint-disable-line
