"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var d3 = _interopRequireWildcard(require("d3"));
var _compass = require("./compass");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
var _default = MountBrush; // const resetedCb = () => reseted(main);
// main.svg.on('dblclick', resetedCb);
// const reseted = (main) => {
//   const { selectUiSweepAct } = main;
//   selectUiSweepAct({ xExtent: false, yExtent: false });
// };
exports.default = _default;