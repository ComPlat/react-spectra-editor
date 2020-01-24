import { LIST_MPYS } from '../constants/list_mpy';

const centerX = (ps, shift) => {
  const pxs = ps.map(p => p.x).sort((a, b) => a - b);
  const centIdx = (ps.length - 1) / 2;
  if (centIdx < 0) return 0;
  return pxs[centIdx] - shift;
};

const calcMpyCenter = (ps, shift, typ) => {
  const count = ps.length;
  const avgX = ps.reduce((sum, nxt) => sum + nxt.x, 0) / ps.length - shift;
  switch (typ) {
    case 's':
      return avgX;
    case 'd':
      return avgX;
    case 't':
      return count === 3 ? centerX(ps, shift) : avgX;
    case 'm':
      return avgX;
    default:
      return avgX;
  }
};

const jD = ps => Math.abs(ps[1].x - ps[0].x);

const jT = (ps) => {
  const pxs = ps.map(p => p.x).sort((a, b) => a - b);
  const one = Math.abs(pxs[1] - pxs[0]);
  const two = Math.abs(pxs[2] - pxs[1]);
  return (one + two) / 2;
};

const calcJ = (ps, shift, typ) => {
  const count = ps.length;
  switch (typ) {
    case 's':
      return false;
    case 'd':
      return count === 2 ? jD(ps) : false;
    case 't':
      return count === 3 ? jT(ps) : false;
    case 'm':
      return false;
    default:
      return false;
  }
};

const calcJStr = (ps, shift, typ) => {
  const cJ = calcJ(ps, shift, typ);
  return cJ ? `J=${(cJ * 1000).toFixed(2)}(Hz)` : '';
};

const calcArea = (d, refArea, refFactor) => (
  (d.area * refFactor / refArea).toFixed(2)
);

const calcMpyType = pks => (
  (pks.length > LIST_MPYS.length || pks.length === 0) ? LIST_MPYS[4] : LIST_MPYS[pks.length - 1]
);

export {
  calcMpyCenter, calcArea, calcJ, calcJStr, calcMpyType,
};
