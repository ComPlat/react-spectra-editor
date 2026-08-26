const d3 = require('d3');

// d3.extent already returns [min, max] in sorted order, so re-sorting it is
// dead work. It also masks the degenerate case: an empty data array (or one
// where every accessor result is undefined) makes d3.extent return
// [undefined, undefined], which would otherwise flow silently into
// scales.x.domain([undefined, undefined]) — NaN transforms and a blank pane
// with no error. Fall back to a fixed placeholder range instead.
export const resolveXExtent = (data, accessor) => {
  const [xL, xU] = d3.extent(data, accessor);
  return (xL === undefined || xU === undefined) ? { xL: 0, xU: 1 } : { xL, xU };
};

export default resolveXExtent;
