'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MouseMove = exports.ClickCompass = exports.TfRescale = exports.MountCompass = undefined;

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _format = require('./format');

var _format2 = _interopRequireDefault(_format);

var _chem = require('./chem');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var TfRescale = function TfRescale(focus) {
  var xt = focus.scales.x;
  var yt = focus.scales.y;
  return { xt: xt, yt: yt };
};

var fetchPt = function fetchPt(focus, xt) {
  var rawMouseX = focus.isFirefox // WORKAROUND d3.mouse firefox compatibility
  ? d3.event.offsetX : d3.mouse(focus.root.node())[0];
  var mouseX = xt.invert(rawMouseX);
  var bisectDate = d3.bisector(function (d) {
    return +d.x;
  }).left;
  var dt = focus.data;
  var ls = dt.length;
  var sortData = ls > 0 && dt[0].x > dt[ls - 1].x ? dt.reverse() : dt;
  var idx = bisectDate(sortData, +mouseX);
  return sortData[idx];
};

var MouseMove = function MouseMove(focus) {
  var _TfRescale = TfRescale(focus),
      xt = _TfRescale.xt,
      yt = _TfRescale.yt;

  var pt = fetchPt(focus, xt);
  var freq = focus.freq,
      layout = focus.layout;

  if (pt) {
    var tx = xt(pt.x);
    var ty = yt(pt.y);
    focus.root.select('.compass').attr('transform', 'translate(' + tx + ',' + ty + ')');
    focus.root.select('.x-hover-line').attr('y1', 0 - ty).attr('y2', focus.h - ty);
    if (_format2.default.isXRDLayout(layout)) {
      var dValue = (0, _chem.Convert2DValue)(pt.x).toFixed(4);
      focus.root.select('.cursor-txt-hz').attr('transform', 'translate(' + tx + ',' + (ty - 30) + ')').text('2Theta: ' + pt.x + ', d-value: ' + dValue);
    } else {
      focus.root.select('.cursor-txt').attr('transform', 'translate(' + tx + ',' + 10 + ')').text(pt.x.toFixed(3));
      if (freq) {
        focus.root.select('.cursor-txt-hz').attr('transform', 'translate(' + tx + ',' + 20 + ')').text((pt.x * freq).toFixed(3) + ' Hz');
      } else {
        focus.root.select('.cursor-txt-hz').text('');
      }
    }
  }
};

var ClickCompass = function ClickCompass(focus) {
  d3.event.stopPropagation();
  d3.event.preventDefault();

  var _TfRescale2 = TfRescale(focus),
      xt = _TfRescale2.xt;

  var pt = fetchPt(focus, xt);
  var onPeak = false;
  focus.clickUiTargetAct(pt, onPeak);
};

var MountCompass = function MountCompass(focus) {
  var root = focus.root,
      w = focus.w,
      h = focus.h;

  var compass = root.append('g').attr('class', 'compass');
  var cursor = root.append('g').attr('class', 'cursor');
  var overlay = root.append('rect').attr('class', 'overlay-focus').attr('width', w).attr('height', h).attr('opacity', 0.0);
  compass.append('line').attr('class', 'x-hover-line hover-line').attr('stroke', '#777').attr('stroke-width', 1).attr('stroke-dasharray', 2, 2);
  compass.append('circle').attr('r', 4).attr('fill', 'none').attr('stroke', '#777').attr('stroke-width', 2);
  cursor.append('text').attr('class', 'cursor-txt').attr('font-family', 'Helvetica').style('font-size', '12px').style('text-anchor', 'middle');
  cursor.append('text').attr('class', 'cursor-txt-hz').attr('font-family', 'Helvetica').style('font-size', '12px').style('text-anchor', 'middle').style('fill', '#D68910');

  overlay.on('mousemove', function () {
    return MouseMove(focus);
  }).on('click', function () {
    return ClickCompass(focus);
  });
};

exports.MountCompass = MountCompass;
exports.TfRescale = TfRescale;
exports.ClickCompass = ClickCompass;
exports.MouseMove = MouseMove;