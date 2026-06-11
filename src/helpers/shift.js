/* eslint-disable prefer-object-spread, default-param-last */
import { LIST_SHIFT_1H } from '../constants/list_shift';

const shiftNone = LIST_SHIFT_1H[0];

const defaultEmptyShift = {
  ref: shiftNone,
  peak: false,
  enable: true,
};

const listEntryAtIndex = (list, index, fallback) => (
  Array.isArray(list) && list[index] !== undefined ? list[index] : fallback
);

const shiftEntryAtIndex = (shiftSt, atIndex = 0) => (
  listEntryAtIndex(shiftSt?.shifts, atIndex, defaultEmptyShift)
);

const normalizeShiftForFormatting = (shift, atIndex = 0) => {
  if (shift?.shifts) {
    return { shift, atIndex };
  }
  return {
    shift: { shifts: [shift || defaultEmptyShift] },
    atIndex: 0,
  };
};

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

const shiftOffsetAtIndex = (shiftSt, atIndex = 0) => {
  const { ref, peak } = shiftEntryAtIndex(shiftSt, atIndex);
  return FromManualToOffset(ref, peak);
};

export {
  defaultEmptyShift,
  listEntryAtIndex,
  shiftEntryAtIndex,
  normalizeShiftForFormatting,
  FromManualToOffset,
  CalcResidualX,
  VirtalPts,
  RealPts,
  shiftOffsetAtIndex,
};
