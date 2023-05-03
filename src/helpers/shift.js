/* eslint-disable prefer-object-spread, default-param-last */
import { LIST_SHIFT_13C } from '../constants/list_shift';

const shiftNone = LIST_SHIFT_13C[0];

const FromManualToOffset = (ref, peak) => {
  if (!peak || ref.name === shiftNone.name) return 0;
  const offset = peak.x - ref.value;
  return offset || 0;
};

const CalcResidualX = (origRef, origApex, nextApex) => {
  if (!nextApex) return 0.0; // nextApex = false
  if (origRef.name === shiftNone.name) return 0.0;
  const origApexX = origApex ? origApex.x : 0.0;
  const origShift = origApexX === 0.0 ? 0.0 : origRef.value; // orig shift
  const resX = origShift - origApexX;
  return resX;
};

const VirtalPts = (pts, resX) => (
  pts.map(
    (pt) => Object.assign(
      {
        x: pt.x + resX,
        y: pt.y,
      },
    ),
  )
);

const RealPts = (pts, resX) => (
  pts.map(
    (pt) => Object.assign(
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
