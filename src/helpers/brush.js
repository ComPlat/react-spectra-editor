import * as d3 from 'd3';

const brushed = (main) => {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return;
  const { context } = main;
  const selection = (d3.event.selection && d3.event.selection.reverse())
    || context.scales.x.range();
  const selectX = selection.map(context.scales.x.invert);
  context.updateBorder(selectX);

  main.svg.call(main.zoom.transform, d3.zoomIdentity);
};

const MountBrush = (main) => {
  const brushedCb = () => brushed(main);

  const { context, brush } = main;

  brush.handleSize(10)
    .extent([[0, 0], [context.w, context.h]])
    .on('end', brushedCb);

  // append brush components
  context.root.append('g')
    .attr('class', 'brush')
    .call(brush);
};

export default MountBrush;
