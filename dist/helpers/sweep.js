"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveVisibleYExtent = exports.buildSweepPayloadFromXBounds = void 0;
const resolveVisibleYExtent = focus => {
  const {
    currentExtent,
    h,
    scales
  } = focus;
  if (currentExtent && currentExtent.yExtent) {
    return currentExtent.yExtent;
  }
  const yes = [h, 0].map(scales.y.invert).sort((a, b) => a - b);
  return {
    yL: yes[0],
    yU: yes[1]
  };
};
exports.resolveVisibleYExtent = resolveVisibleYExtent;
const buildSweepPayloadFromXBounds = (focus, xA, xB) => {
  const {
    data,
    dataPks
  } = focus;
  const xes = [xA, xB].map(x => Number(x)).sort((a, b) => a - b);
  return {
    xExtent: {
      xL: xes[0],
      xU: xes[1]
    },
    yExtent: resolveVisibleYExtent(focus),
    data,
    dataPks
  };
};
exports.buildSweepPayloadFromXBounds = buildSweepPayloadFromXBounds;