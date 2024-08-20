const d3 = require('d3');

const drawMain = (klass, w, h, d3svgClass = 'd3Svg') => {
  d3.select(klass).append('svg')
    .attr('class', d3svgClass)
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

const drawDestroy = (klass) => d3.select(`${klass} > *`).remove();

const drawArrowOnCurve = (klass, isHidden) => {
  if (isHidden) {
    d3.select(klass).selectAll('marker').remove();
  } else {
    d3.select(klass).selectAll('marker').remove();
    const arrowLeft = d3.select(klass).selectAll('defs')
      .append('marker')
      .attr('id', 'arrow-left')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 5)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .attr('fill', '#00AA0099');
    arrowLeft.append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z');

    // const arrowRight = d3.select(klass).selectAll('defs')
    //   .append('marker')
    //   .attr('id', 'arrow-right')
    //   .attr('viewBox', '0 0 10 10')
    //   .attr('refX', 5)
    //   .attr('refY', 5)
    //   .attr('markerWidth', 6)
    //   .attr('markerHeight', 6)
    //   .attr('orient', 'auto-start-reverse');
    // arrowRight.append('path')
    //   .attr('d', 'M 0 0 L 10 5 L 0 10 z');
  }
};

export {
  drawMain, drawLabel, drawDisplay, drawDestroy, drawArrowOnCurve,
};
