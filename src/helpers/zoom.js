import * as d3 from 'd3';

const zoomed = (target) => {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return;
  const tf = d3.event.transform;
  const { focus } = target;
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

  // Grid Re-Calculate
  focus.grid.x.call(focus.axisCall.x
    .tickSize(-focus.h, 0, 0));
  focus.grid.y.call(focus.axisCall.y
    .tickSize(-focus.w, 0, 0));
};

const resetZoom = (target) => {
  target.svg.call(target.zoom.transform, d3.zoomIdentity);
  target.svg.selectAll('.brush').call(target.brush.move, null);
};

const MountZoom = (target) => {
  const zoomedCb = () => zoomed(target);
  const resetZoomCb = () => resetZoom(target);

  target.zoom.on('zoom', zoomedCb);
  target.svg.call(target.zoom)
    .on('dblclick.zoom', resetZoomCb);
};

export default MountZoom;
