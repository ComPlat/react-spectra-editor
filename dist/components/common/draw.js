"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawMain = exports.drawLabel = exports.drawDisplay = exports.drawDestroy = exports.drawArrowOnCurve = void 0;
var d3 = _interopRequireWildcard(require("d3"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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