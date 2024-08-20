"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _compass = require("./compass");
/* eslint-disable prefer-object-spread */

const d3 = require('d3');
const wheeled = (focus, event) => {
  const {
    currentExtent,
    scrollUiWheelAct,
    brushClass
  } = focus;
  // WORKAROUND: firefox wheel compatibilty
  const wheelEvent = focus.isFirefox ? -event.deltaY : event.wheelDelta; // eslint-disable-line
  const direction = wheelEvent > 0;
  scrollUiWheelAct(Object.assign({}, currentExtent, {
    direction,
    brushClass
  }));
};
const brushed = function (focus, isUiAddIntgSt, event) {
  let brushedClass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '.d3Svg';
  const {
    selectUiSweepAct,
    data,
    dataPks,
    brush,
    w,
    h,
    scales
  } = focus;
  const selection = event.selection && event.selection.reverse();
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
  d3.select(brushedClass).selectAll('.brush').call(brush.move, null);
};
const MountBrush = function (focus, isUiAddIntgSt, isUiNoBrushSt) {
  let brushedClass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '.d3Svg';
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
  const brushedCb = event => brushed(focus, isUiAddIntgSt, event, brushedClass);
  const wheeledCb = event => wheeled(focus, event);
  if (isUiNoBrushSt) {
    const target = isUiAddIntgSt ? brushX : brush;
    target.handleSize(10).extent([[0, 0], [w, h]]).on('end', brushedCb);

    // append brush components
    const klass = isUiAddIntgSt ? 'brushX' : 'brush';
    root.append('g').attr('class', klass).on('mousemove', event => (0, _compass.MouseMove)(event, focus)).call(target);
  }
  svg.on('wheel', wheeledCb);
};
var _default = exports.default = MountBrush; // const resetedCb = () => reseted(main);
// main.svg.on('dblclick', resetedCb);
// const reseted = (main) => {
//   const { selectUiSweepAct } = main;
//   selectUiSweepAct({ xExtent: false, yExtent: false });
// };