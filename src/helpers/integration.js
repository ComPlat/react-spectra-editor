/* eslint-disable no-mixed-operators */
import { calcSlope } from './calc';

const getArea = (xL, xU, data) => {
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

const getAbsoluteArea = (xL, xU, data) => {
  const ps = data.filter((d) => d.x > xL && d.x < xU);
  if (!ps[0]) return 0;

  let area = 0;
  const point1 = ps[0];
  const point2 = ps[ps.length - 1];
  const slope = calcSlope(point1.x, point1.y, point2.x, point2.y);
  let lastDY = point1.y;

  if (ps.length > 1) {
    for (let i = 1; i < ps.length; i += 1) {
      const pt = ps[i];
      const lastD = ps[i - 1];
      const y = slope * (pt.x - lastD.x) + lastDY;
      lastDY = y;
      const delta = Math.abs(pt.y - y);
      area += delta;
    }
  }

  return area;
};

const calcArea = (d, refArea, refFactor, ignoreRef = false) => {
  if (ignoreRef) {
    return d.absoluteArea.toFixed(2);
  }
  return (d.area * refFactor / refArea).toFixed(2);
};

export { getArea, calcArea, getAbsoluteArea };  // eslint-disable-line
