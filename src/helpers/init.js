import * as d3 from 'd3';

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

export {
  InitScale, InitAxisCall, InitPathCall,
};
