'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _d2 = require('d3');

var d3 = _interopRequireWildcard(_d2);

var _compass = require('./compass');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var wheeled = function wheeled(focus) {
  var currentExtent = focus.currentExtent,
      scrollUiWheelAct = focus.scrollUiWheelAct;

  var wheelEvent = focus.isFirefox ? -d3.event.deltaY : d3.event.wheelDelta; // WORKAROUND: firefox wheel compatibilty
  var direction = wheelEvent > 0;
  scrollUiWheelAct(Object.assign({}, currentExtent, { direction: direction }));
};

var brushed = function brushed(focus, isUiAddIntgSt) {
  var selectUiSweepAct = focus.selectUiSweepAct,
      data = focus.data,
      dataPks = focus.dataPks,
      brush = focus.brush,
      w = focus.w,
      h = focus.h,
      scales = focus.scales;

  var selection = d3.event.selection && d3.event.selection.reverse();
  if (!selection) return;
  var xes = [w, 0].map(scales.x.invert).sort(function (a, b) {
    return a - b;
  });
  var yes = [h, 0].map(scales.y.invert).sort(function (a, b) {
    return a - b;
  });
  var xExtent = { xL: xes[0], xU: xes[1] };
  var yExtent = { yL: yes[0], yU: yes[1] };
  if (isUiAddIntgSt) {
    xes = selection.map(scales.x.invert).sort(function (a, b) {
      return a - b;
    });
    xExtent = { xL: xes[0], xU: xes[1] };
  } else {
    var _selection = _slicedToArray(selection, 2),
        begPt = _selection[0],
        endPt = _selection[1];

    xes = [begPt[0], endPt[0]].map(scales.x.invert).sort(function (a, b) {
      return a - b;
    });
    yes = [begPt[1], endPt[1]].map(scales.y.invert).sort(function (a, b) {
      return a - b;
    });
    xExtent = { xL: xes[0], xU: xes[1] };
    yExtent = { yL: yes[0], yU: yes[1] };
  }
  selectUiSweepAct({
    xExtent: xExtent, yExtent: yExtent, data: data, dataPks: dataPks
  });
  d3.select('.d3Svg').selectAll('.brush').call(brush.move, null);
};

var MountBrush = function MountBrush(focus, isUiAddIntgSt, isUiNoBrushSt) {
  var root = focus.root,
      svg = focus.svg,
      brush = focus.brush,
      brushX = focus.brushX,
      w = focus.w,
      h = focus.h;

  svg.selectAll('.brush').remove();
  svg.selectAll('.brushX').remove();

  var brushedCb = function brushedCb() {
    return brushed(focus, isUiAddIntgSt);
  };
  var wheeledCb = function wheeledCb() {
    return wheeled(focus);
  };

  if (isUiNoBrushSt) {
    var target = isUiAddIntgSt ? brushX : brush;
    target.handleSize(10).extent([[0, 0], [w, h]]).on('end', brushedCb);

    // append brush components
    var klass = isUiAddIntgSt ? 'brushX' : 'brush';
    root.append('g').attr('class', klass).on('mousemove', function () {
      return (0, _compass.MouseMove)(focus);
    }).call(target);
  }

  svg.on('wheel', wheeledCb);
};

exports.default = MountBrush;

// const resetedCb = () => reseted(main);
// main.svg.on('dblclick', resetedCb);
// const reseted = (main) => {
//   const { selectUiSweepAct } = main;
//   selectUiSweepAct({ xExtent: false, yExtent: false });
// };