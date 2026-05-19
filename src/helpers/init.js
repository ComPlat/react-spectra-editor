import d3Tip from 'd3-tip';
import FN from './format';

const d3 = require('d3');

const InitScale = (target, reverse = true) => {
  const xRange = reverse ? [target.w, 0] : [0, target.w];
  const x = d3.scaleLinear()
    .range(xRange);
  const y = d3.scaleLinear()
    .range([target.h, 0]);
  return { x, y };
};

const InitAxisCall = (count) => {
  const yAxisFormat = d3.format('.2n');
  const xAxisCall = d3.axisBottom()
    .ticks(10);
  const yAxisCall = d3.axisLeft()
    .ticks(count)
    .tickFormat(yAxisFormat);
  return { x: xAxisCall, y: yAxisCall };
};

const InitPathCall = (target) => {
  const line = d3.line()
    .x((d) => target.scales.x(d.x))
    .y((d) => target.scales.y(d.y));
  return line;
};

const tpStyle = () => {
  const stBorder = ' border: 2px solid #aaa;';
  const stBorderRadius = ' border-radius: 5px;';
  const stBackground = ' background: #555;';
  const stColor = ' color: #fff;';
  const stPadding = ' padding: 8px;';
  const stOpacity = ' opacity: 0.9; ';
  const stZindex = ' z-index: 1999;';
  const stFontFamily = ' font-family: Helvetica;';
  const style = stBorder + stBorderRadius + stBackground + stColor
    + stPadding + stOpacity + stPadding + stZindex + stFontFamily;

  return style;
};

const tpDiv = (d, digits, yFactor = 1) => (
  `
  <div
    class="peak-tp"
    style="${tpStyle()}"
  >
    <span> x: ${FN.fixDigit(d.x, digits)}</span>
    <br/>
    <span> y: ${d3.format('.2~e')(d.y * (yFactor || 1))}</span>
  <div>
  `
);

const msPeakTpDiv = (d, relInt, digits) => (
  `
  <div
    class="peak-tp"
    style="${tpStyle()}"
  >
    <span>${FN.fixDigit(d.x, digits)} (${relInt})</span>
  <div>
  `
);

const resolveDigits = (layout, xDigits) => (
  xDigits != null && xDigits !== ''
    ? FN.clampDecimalPlaces(xDigits, FN.spectraDigit(layout))
    : FN.spectraDigit(layout)
);

const peakTipHtml = ({
  d, layout, yFactor, xDigits, msMaxY,
}) => {
  const digits = resolveDigits(layout, xDigits);
  if (FN.isMsLayout(layout) && msMaxY > 0) {
    const relPct = (100 * d.y) / msMaxY;
    const rel = parseInt(relPct, 10);
    return msPeakTpDiv(d, rel, digits);
  }
  return tpDiv(d, digits, yFactor || 1);
};

const InitTip = () => {
  d3.select('.peak-tp').remove();
  const tip = d3Tip()
    .attr('class', 'd3-tip')
    .html(peakTipHtml);
  return tip;
};

export {
  InitScale, InitAxisCall, InitPathCall, InitTip,
};
