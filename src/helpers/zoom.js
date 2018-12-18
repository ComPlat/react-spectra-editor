import * as d3 from 'd3';

const zoomed = (canvas) => {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return;
  const tf = d3.event.transform;
  const { focus } = canvas;
  // Axis Re-Calculate
  const updScaleX = tf.rescaleX(focus.scales.x);
  const updScaleY = tf.rescaleY(focus.scales.y);
  focus.axisCall.x.scale(updScaleX);
  focus.axisCall.y.scale(updScaleY);
  // Line function Re-Define
  const line = d3.line()
    .x(d => updScaleX(d.x))
    .y(d => updScaleY(d.y));
  // Path Re-Calculate
  focus.path.attr('d', line(focus.data));

  // Threshold
  if (focus.tEndPts.length > 0) {
    focus.thresLine.attr('d', line(focus.tEndPts));
    focus.thresLine.attr('visibility', 'visible');
  } else {
    focus.thresLine.attr('visibility', 'hidden');
  }

  // Grid Re-Calculate
  focus.grid.x.call(focus.axisCall.x
    .tickSize(-focus.h, 0, 0))
    .selectAll('line')
    .attr('stroke', '#bbbbbb')
    .attr('stroke-opacity', 0.6)
    .attr('fill', 'none');
  focus.grid.y.call(focus.axisCall.y
    .tickSize(-focus.w, 0, 0))
    .selectAll('line')
    .attr('stroke', '#bbbbbb')
    .attr('stroke-opacity', 0.6)
    .attr('fill', 'none');

  // ccPattern Re-Calculate
  focus.drawPeaks();
};

const resetZoom = (canvas) => {
  canvas.svg.call(canvas.zoom.transform, d3.zoomIdentity);
  canvas.svg.selectAll('.brush').call(canvas.brush.move, null);
};

const MountZoom = (canvas) => {
  const zoomedCb = () => zoomed(canvas);
  const resetZoomCb = () => {
    d3.event.stopPropagation();
    d3.event.preventDefault();
    resetZoom(canvas);
  };

  canvas.zoom.on('zoom', zoomedCb);
  canvas.svg.call(canvas.zoom)
    .on('contextmenu.zoom', resetZoomCb);
};

export default MountZoom;
