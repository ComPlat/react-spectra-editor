import * as d3 from 'd3';

const brushed = (canvas) => {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return;
  const { context } = canvas;
  const selection = d3.event.selection
    && d3.event.selection.reverse()
    || context.scales.x.range();
  const selectX = selection.map(context.scales.x.invert);
  context.updateBorder(selectX);

  canvas.svg.call(canvas.zoom.transform, d3.zoomIdentity);
};

const MountBrush = (canvas) => {
  const brushedCb = () => brushed(canvas);

  const { context, brush } = canvas;

  brush.handleSize(10)
    .extent([[0, 0], [context.w, context.h]])
    .on('end', brushedCb);

  // append brush components
  context.root.append('g')
    .attr('class', 'brush')
    .call(brush);
};

export default MountBrush;
