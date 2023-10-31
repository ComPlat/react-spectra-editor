"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var d3 = _interopRequireWildcard(require("d3"));
var _compass = require("./compass");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/* eslint-disable prefer-object-spread */

const wheeled = focus => {
  const {
    currentExtent,
    scrollUiWheelAct
  } = focus;
  // WORKAROUND: firefox wheel compatibilty
  const wheelEvent = focus.isFirefox ? -d3.event.deltaY : d3.event.wheelDelta; // eslint-disable-line
  const direction = wheelEvent > 0;
  scrollUiWheelAct(Object.assign({}, currentExtent, {
    direction
  }));
};
const brushed = (focus, isUiAddIntgSt) => {
  const {
    selectUiSweepAct,
    data,
    dataPks,
    brush,
    w,
    h,
    scales
  } = focus;
  const selection = d3.event.selection && d3.event.selection.reverse();
  if (!selection) return;
  let xes = [w, 0].map(scales.x.invert).sort((a, b) => a - b);
  let yes = [h, 0].map(scales.y.invert).sort((a, b) => a - b);
  let xExtent = {
    xL: xes[0],
    xU: xes[1]
  };
  let yExtent = {
    yL: yes[0],
    yU: yes[1]
  };
  if (isUiAddIntgSt) {
    xes = selection.map(scales.x.invert).sort((a, b) => a - b);
    xExtent = {
      xL: xes[0],
      xU: xes[1]
    };
  } else {
    const [begPt, endPt] = selection;
    xes = [begPt[0], endPt[0]].map(scales.x.invert).sort((a, b) => a - b);
    yes = [begPt[1], endPt[1]].map(scales.y.invert).sort((a, b) => a - b);
    xExtent = {
      xL: xes[0],
      xU: xes[1]
    };
    yExtent = {
      yL: yes[0],
      yU: yes[1]
    };
  }
  selectUiSweepAct({
    xExtent,
    yExtent,
    data,
    dataPks
  });
  d3.select('.d3Svg').selectAll('.brush').call(brush.move, null);
};
const MountBrush = (focus, isUiAddIntgSt, isUiNoBrushSt) => {
  const {
    root,
    svg,
    brush,
    brushX,
    w,
    h
  } = focus;
  svg.selectAll('.brush').remove();
  svg.selectAll('.brushX').remove();
  const brushedCb = () => brushed(focus, isUiAddIntgSt);
  const wheeledCb = () => wheeled(focus);
  if (isUiNoBrushSt) {
    const target = isUiAddIntgSt ? brushX : brush;
    target.handleSize(10).extent([[0, 0], [w, h]]).on('end', brushedCb);

    // append brush components
    const klass = isUiAddIntgSt ? 'brushX' : 'brush';
    root.append('g').attr('class', klass).on('mousemove', () => (0, _compass.MouseMove)(focus)).call(target);
  }
  svg.on('wheel', wheeledCb);
};
var _default = exports.default = MountBrush; // const resetedCb = () => reseted(main);
// main.svg.on('dblclick', resetedCb);
// const reseted = (main) => {
//   const { selectUiSweepAct } = main;
//   selectUiSweepAct({ xExtent: false, yExtent: false });
// };