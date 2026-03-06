/* eslint-disable no-mixed-operators */
import { calcSlope } from './calc';

const getValueKey = (data) => {
  if (!Array.isArray(data) || data.length === 0) return null;
  const sample = data[0];
  if ('k' in sample) return 'k';
  if ('y' in sample) return 'y';
  return null;
};

const getArea = (xL, xU, data) => {
  const valueKey = getValueKey(data);
  if (!valueKey) {
    return NaN;
  }

  let area = 0;
  for (let i = 1; i < data.length; i += 1) {
    const prev = data[i - 1];
    const curr = data[i];
    if (prev.x >= xL && curr.x <= xU) {
      const deltaX = curr.x - prev.x;
      const avgY = (prev[valueKey] + curr[valueKey]) / 2;
      area += deltaX * avgY;
    }
  }
  return area;
};

const getAbsoluteArea = (xL, xU, data) => {
  const valueKey = getValueKey(data);
  if (!valueKey) {
    return NaN;
  }

  const ps = data.filter((d) => d.x > xL && d.x < xU);
  if (ps.length < 2) return 0;

  let area = 0;
  const point1 = ps[0];
  const point2 = ps[ps.length - 1];

  const slope = calcSlope(point1.x, point1[valueKey], point2.x, point2[valueKey]);
  let lastY = point1[valueKey];

  for (let i = 1; i < ps.length; i += 1) {
    const pt = ps[i];
    const lastPt = ps[i - 1];
    const expectedY = slope * (pt.x - lastPt.x) + lastY;
    lastY = expectedY;

    const delta = Math.abs(pt[valueKey] - expectedY);
    area += delta;
  }

  return area;
};

const calcArea = (d, refArea, refFactor, ignoreRef = false) => {
  if (ignoreRef) {
    const { absoluteArea } = d;
    return !absoluteArea ? 0 : d.absoluteArea.toFixed(2);
  }
  return (d.area * refFactor / refArea).toFixed(2);
};

export { getArea, calcArea, getAbsoluteArea };  // eslint-disable-line
