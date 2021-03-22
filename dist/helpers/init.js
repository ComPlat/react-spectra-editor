'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InitTip = exports.InitPathCall = exports.InitAxisCall = exports.InitScale = undefined;

var _d = require('d3');

var d3 = _interopRequireWildcard(_d);

var _d3Tip = require('d3-tip');

var _d3Tip2 = _interopRequireDefault(_d3Tip);

var _format = require('./format');

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var InitScale = function InitScale(target) {
  var reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var xRange = reverse ? [target.w, 0] : [0, target.w];
  var x = d3.scaleLinear().range(xRange);
  var y = d3.scaleLinear().range([target.h, 0]);
  return { x: x, y: y };
};

var InitAxisCall = function InitAxisCall(count) {
  var yAxisFormat = d3.format('.2n');
  var xAxisCall = d3.axisBottom().ticks(10);
  var yAxisCall = d3.axisLeft().ticks(count).tickFormat(yAxisFormat);
  return { x: xAxisCall, y: yAxisCall };
};

var InitPathCall = function InitPathCall(target) {
  var line = d3.line().x(function (d) {
    return target.scales.x(d.x);
  }).y(function (d) {
    return target.scales.y(d.y);
  });
  return line;
};

var tpStyle = function tpStyle() {
  var stBorder = ' border: 2px solid #aaa;';
  var stBorderRadius = ' border-radius: 5px;';
  var stBackground = ' background: #555;';
  var stColor = ' color: #fff;';
  var stPadding = ' padding: 8px;';
  var stOpacity = ' opacity: 0.9; ';
  var stZindex = ' z-index: 1999;';
  var stFontFamily = ' font-family: Helvetica;';
  var style = stBorder + stBorderRadius + stBackground + stColor + stPadding + stOpacity + stPadding + stZindex + stFontFamily;

  return style;
};

var tpDiv = function tpDiv(d, digits) {
  return '\n  <div\n    class="peak-tp"\n    style="' + tpStyle() + '"\n  >\n    <span> x: ' + _format2.default.fixDigit(d.x, digits) + '</span>\n    <br/>\n    <span> y: ' + d3.format('.2~e')(d.y) + '</span>\n  <div>\n  ';
};

var InitTip = function InitTip() {
  d3.select('.peak-tp').remove();
  var tip = (0, _d3Tip2.default)().attr('class', 'd3-tip').html(function (_ref) {
    var d = _ref.d,
        layout = _ref.layout;
    return tpDiv(d, _format2.default.spectraDigit(layout));
  });
  return tip;
};

exports.InitScale = InitScale;
exports.InitAxisCall = InitAxisCall;
exports.InitPathCall = InitPathCall;
exports.InitTip = InitTip;