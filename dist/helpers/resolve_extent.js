"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveYExtent = exports.resolveXExtent = exports.default = void 0;
const d3 = require('d3');

// d3.extent already returns [min, max] in sorted order, so re-sorting it is
// dead work. It also masks the degenerate case: an empty data array (or one
// where every accessor result is undefined) makes d3.extent return
// [undefined, undefined], which would otherwise flow silently into
// scales.x.domain([undefined, undefined]) — NaN transforms and a blank pane
// with no error. Fall back to a fixed placeholder range instead.
const resolveXExtent = (data, accessor) => {
  const [xL, xU] = d3.extent(data, accessor);
  return xL === undefined || xU === undefined ? {
    xL: 0,
    xU: 1
  } : {
    xL,
    xU
  };
};

// The y half of the same setConfig has the same degenerate case, and one extra
// step to get wrong: d3.min/d3.max over an empty (or all-undefined) set return
// undefined, and the `factor` padding below turns that into NaN before it ever
// reaches scales.y.domain(). Both focus classes computed this identically, so
// the padding lives here once rather than twice.
exports.resolveXExtent = resolveXExtent;
const resolveYExtent = (data, accessor, factor) => {
  const btm = d3.min(data, accessor);
  const top = d3.max(data, accessor);
  if (btm === undefined || top === undefined) return {
    yL: 0,
    yU: 1
  };
  const height = top - btm;
  return {
    yL: btm - factor * height,
    yU: top + factor * height
  };
};
exports.resolveYExtent = resolveYExtent;
var _default = exports.default = resolveXExtent;