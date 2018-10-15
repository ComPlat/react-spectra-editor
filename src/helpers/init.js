import * as d3 from 'd3';
import d3Tip from 'd3-tip';

const InitScale = (target) => {
  const x = d3.scaleLinear()
    .range([target.w, 0]);
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
    .x(d => target.scales.x(d.x))
    .y(d => target.scales.y(d.y));
  return line;
};

const InitTip = () => {
  const tip = d3Tip()
    .attr('class', 'd3-tip')
    .html((d) => {
      let text = `<strong>X: </strong> <span style='color:red'>${d3.format('.3~s')(d.x)}</span><br>`;
      text += `<strong>Y: </strong> <span style='color:red'>${d3.format('.2~e')(d.y)}</span><br>`;
      return text;
    });
  return tip;
};

export {
  InitScale, InitAxisCall, InitPathCall, InitTip,
};
