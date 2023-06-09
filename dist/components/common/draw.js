"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawMain = exports.drawLabel = exports.drawDisplay = exports.drawDestroy = exports.drawArrowOnCurve = void 0;
var d3 = _interopRequireWildcard(require("d3"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const drawMain = (klass, w, h) => {
  d3.select(klass).append('svg').attr('class', 'd3Svg').attr('preserveAspectRatio', 'xMinYMin meet').attr('viewBox', `0 0 ${w} ${h}`);
};
exports.drawMain = drawMain;
const drawLabel = (klass, cLabel, xLabel, yLabel) => {
  d3.select(klass).selectAll('.xLabel').text(xLabel);
  d3.select(klass).selectAll('.yLabel').text(yLabel);
  if (cLabel) {
    d3.select(klass).selectAll('.mark-text').text(cLabel);
  }
};
exports.drawLabel = drawLabel;
const drawDisplay = (klass, isHidden) => {
  if (isHidden) {
    d3.select(klass).selectAll('svg').style('width', 0);
  } else {
    d3.select(klass).selectAll('svg').style('width', '100%');
  }
};
exports.drawDisplay = drawDisplay;
const drawDestroy = klass => d3.select(`${klass} > *`).remove();
exports.drawDestroy = drawDestroy;
const drawArrowOnCurve = (klass, isHidden) => {
  if (isHidden) {
    d3.select(klass).selectAll('marker').remove();
  } else {
    d3.select(klass).selectAll('marker').remove();
    const arrowLeft = d3.select(klass).selectAll('defs').append('marker').attr('id', 'arrow-left').attr('viewBox', '0 0 10 10').attr('refX', 5).attr('refY', 5).attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto').attr('fill', '#00AA0099');
    arrowLeft.append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z');

    // const arrowRight = d3.select(klass).selectAll('defs')
    //   .append('marker')
    //   .attr('id', 'arrow-right')
    //   .attr('viewBox', '0 0 10 10')
    //   .attr('refX', 5)
    //   .attr('refY', 5)
    //   .attr('markerWidth', 6)
    //   .attr('markerHeight', 6)
    //   .attr('orient', 'auto-start-reverse');
    // arrowRight.append('path')
    //   .attr('d', 'M 0 0 L 10 5 L 0 10 z');
  }
};
exports.drawArrowOnCurve = drawArrowOnCurve;