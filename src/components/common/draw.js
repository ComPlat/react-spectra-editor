import * as d3 from 'd3';

const drawMain = (klass, w, h, hasSecondaryY) => {
  let width = w;
  if (hasSecondaryY) {
    width = w * 1.04;
  }
  d3.select(klass).append('svg')
    .attr('class', 'd3Svg')
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', `0 0 ${width} ${h}`);
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

const drawDestroySecondaryAxis = (klass) => {
  const secondaryAxisClass = 'y-secondary-axis';
  const secondaryLabelClass = 'secondaryYLabel';

  d3.select(`${klass} .${secondaryAxisClass}`).remove();
  d3.select(`${klass} .${secondaryLabelClass}`).remove();
};

const drawArrowOnCurve = (klass, isHidden) => {
  const removeMarkers = () => {
    d3.select(klass).selectAll('marker').remove();
  };

  const createArrowMarker = (id, fillColor) => d3.select(klass).selectAll('defs')
    .append('marker')
    .attr('id', id)
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 5)
    .attr('refY', 5)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('fill', fillColor);

  if (isHidden) {
    removeMarkers();
  } else {
    removeMarkers();

    createArrowMarker('arrow-left', '#00AA0099')
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z');

    createArrowMarker('arrow-left-black', 'black')
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z');
  }
};

export {
  drawMain, drawLabel, drawDisplay, drawDestroy, drawArrowOnCurve, drawDestroySecondaryAxis,
};
