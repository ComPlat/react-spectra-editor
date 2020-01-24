import * as d3 from 'd3';

const drawMain = (klass, w, h) => {
  d3.select(klass).append('svg')
    .attr('class', 'd3Svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', `0 0 ${w} ${h}`);
};

const drawLabel = (klass, cLabel, xLabel, yLabel) => {
  d3.select(klass).selectAll('.xLabel').text(xLabel);
  d3.select(klass).selectAll('.yLabel').text(yLabel);
  if (cLabel) {
    d3.select(klass).selectAll('.mark-text').text(cLabel);
  }
};

const drawDisplay = (klass, isHidden) => {
  if (isHidden) {
    d3.select(klass).selectAll('svg').style('width', 0);
  } else {
    d3.select(klass).selectAll('svg').style('width', '100%');
  }
};

const drawDestroy = klass => d3.select(`${klass} > *`).remove();

export {
  drawMain, drawLabel, drawDisplay, drawDestroy,
};
