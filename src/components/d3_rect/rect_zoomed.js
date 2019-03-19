import * as d3 from 'd3';

const Zoomed = (main) => {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return;
  const tf = d3.event.transform;
  const { focus } = main;
  // Axis Re-Calculate
  const updScaleX = tf.rescaleX(focus.scales.x);
  const updScaleY = tf.rescaleY(focus.scales.y);
  focus.axisCall.x.scale(updScaleX);
  focus.axisCall.y.scale(updScaleY);

  // Re-Calculate
  focus.drawBar();
  focus.drawThres();
  focus.drawGrid();
};

export default Zoomed;
