"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InitTip = exports.InitScale = exports.InitPathCall = exports.InitAxisCall = void 0;
var d3 = _interopRequireWildcard(require("d3"));
var _d3Tip = _interopRequireDefault(require("d3-tip"));
var _format = _interopRequireDefault(require("./format"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const InitScale = function (target) {
  let reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  const xRange = reverse ? [target.w, 0] : [0, target.w];
  const x = d3.scaleLinear().range(xRange);
  const y = d3.scaleLinear().range([target.h, 0]);
  return {
    x,
    y
  };
};
exports.InitScale = InitScale;
const InitAxisCall = count => {
  const yAxisFormat = d3.format('.2n');
  const xAxisCall = d3.axisBottom().ticks(10);
  const yAxisCall = d3.axisLeft().ticks(count).tickFormat(yAxisFormat);
  return {
    x: xAxisCall,
    y: yAxisCall
  };
};
exports.InitAxisCall = InitAxisCall;
const InitPathCall = target => {
  const line = d3.line().x(d => target.scales.x(d.x)).y(d => target.scales.y(d.y));
  return line;
};
exports.InitPathCall = InitPathCall;
const tpStyle = () => {
  const stBorder = ' border: 2px solid #aaa;';
  const stBorderRadius = ' border-radius: 5px;';
  const stBackground = ' background: #555;';
  const stColor = ' color: #fff;';
  const stPadding = ' padding: 8px;';
  const stOpacity = ' opacity: 0.9; ';
  const stZindex = ' z-index: 1999;';
  const stFontFamily = ' font-family: Helvetica;';
  const style = stBorder + stBorderRadius + stBackground + stColor + stPadding + stOpacity + stPadding + stZindex + stFontFamily;
  return style;
};
const tpDiv = (d, digits) => `
  <div
    class="peak-tp"
    style="${tpStyle()}"
  >
    <span> x: ${_format.default.fixDigit(d.x, digits)}</span>
    <br/>
    <span> y: ${d3.format('.2~e')(d.y)}</span>
  <div>
  `;
const InitTip = () => {
  d3.select('.peak-tp').remove();
  const tip = (0, _d3Tip.default)().attr('class', 'd3-tip').html(_ref => {
    let {
      d,
      layout
    } = _ref;
    return tpDiv(d, _format.default.spectraDigit(layout));
  });
  return tip;
};
exports.InitTip = InitTip;