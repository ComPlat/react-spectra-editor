import LIST_SHIFT from '../constants/list_shift';

const FromManualToOffset = (ref, peak) => {
  if (!peak || ref.name === LIST_SHIFT[0].name) return 0;
  const offset = peak.x - ref.value;
  return offset || 0;
};

const CalcResidualX = (origRef, origApex, nextApex) => {
  if (!nextApex) return 0.0; // nextApex = false
  if (origRef.name === LIST_SHIFT[0].name) return 0.0; // orig ref = LIST_SHIFT[0]
  const origApexX = origApex ? origApex.x : 0.0;
  const origShift = origApexX === 0.0 ? 0.0 : origRef.value; // orig shift
  const resX = origShift - origApexX;
  return resX;
};

const VirtalPts = (pts, resX) => (
  pts.map(
    pt => Object.assign(
      {
        x: pt.x + resX,
        y: pt.y,
      },
    ),
  )
);

const RealPts = (pts, resX) => (
  pts.map(
    pt => Object.assign(
      {
        x: pt.x - resX,
        y: pt.y,
      },
    ),
  )
);

export {
  FromManualToOffset, CalcResidualX, VirtalPts, RealPts,
};
