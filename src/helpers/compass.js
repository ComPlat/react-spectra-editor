import * as d3 from 'd3';

const TfRescale = (focus) => {
  const xt = focus.scales.x;
  const yt = focus.scales.y;
  return { xt, yt };
};

const fetchPt = (focus, xt) => {
  const rawMouseX = focus.isFirefox // WORKAROUND d3.mouse firefox compatibility
    ? d3.event.offsetX
    : d3.mouse(focus.root.node())[0];
  const mouseX = xt.invert(rawMouseX);
  const bisectDate = d3.bisector(d => +d.x).left;
  const dt = focus.data;
  const ls = dt.length;
  const sortData = ls > 0 && dt[0].x > dt[ls - 1].x ? dt.reverse() : dt;
  const idx = bisectDate(sortData, +mouseX);
  return sortData[idx];
};

const MouseMove = (focus) => {
  const { xt, yt } = TfRescale(focus);
  const pt = fetchPt(focus, xt);
  const { freq } = focus;
  if (pt) {
    const tx = xt(pt.x);
    const ty = yt(pt.y);
    focus.root.select('.compass').attr('transform', `translate(${tx},${ty})`);
    focus.root.select('.x-hover-line')
      .attr('y1', 0 - ty)
      .attr('y2', focus.h - ty);
    focus.root.select('.cursor-txt')
      .attr('transform', `translate(${tx},${10})`)
      .text(pt.x.toFixed(3));
    if (freq) {
      focus.root.select('.cursor-txt-hz')
        .attr('transform', `translate(${tx},${20})`)
        .text(`${(pt.x * freq).toFixed(3)} Hz`);
    }
  }
};

const ClickCompass = (focus) => {
  d3.event.stopPropagation();
  d3.event.preventDefault();
  const { xt } = TfRescale(focus);
  const pt = fetchPt(focus, xt);
  const onPeak = false;
  focus.clickUiTargetAct(pt, onPeak);
};

const MountCompass = (focus) => {
  const { root, w, h } = focus;
  const compass = root.append('g')
    .attr('class', 'compass');
  const cursor = root.append('g')
    .attr('class', 'cursor');
  const overlay = root.append('rect')
    .attr('class', 'overlay-focus')
    .attr('width', w)
    .attr('height', h)
    .attr('opacity', 0.0);
  compass.append('line')
    .attr('class', 'x-hover-line hover-line')
    .attr('stroke', '#777')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', 2, 2);
  compass.append('circle')
    .attr('r', 4)
    .attr('fill', 'none')
    .attr('stroke', '#777')
    .attr('stroke-width', 2);
  cursor.append('text')
    .attr('class', 'cursor-txt')
    .attr('font-family', 'Helvetica')
    .style('font-size', '12px')
    .style('text-anchor', 'middle');
  cursor.append('text')
    .attr('class', 'cursor-txt-hz')
    .attr('font-family', 'Helvetica')
    .style('font-size', '12px')
    .style('text-anchor', 'middle')
    .style('fill', '#D68910');

  overlay
    .on('mousemove', () => MouseMove(focus))
    .on('click', () => ClickCompass(focus));
};

export {
  MountCompass,
  TfRescale,
  ClickCompass,
  MouseMove,
};
