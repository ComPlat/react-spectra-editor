import * as d3 from 'd3';

const TfRescale = (focus) => {
  const xt = focus.scales.x;
  const yt = focus.scales.y;
  return { xt, yt };
};

const fetchPt = (focus, xt) => {
  const mouseX = xt.invert(d3.mouse(focus.root.node())[0]);
  const bisectDate = d3.bisector(d => +d.x).left;
  const dt = focus.data;
  const ls = dt.length;
  const sortData = ls > 0 && dt[0].x > dt[ls - 1].x ? dt.reverse() : dt;
  const idx = bisectDate(sortData, +mouseX);
  return sortData[idx];
};

const mouseMove = (focus, compass) => {
  const { xt, yt } = TfRescale(focus);
  const pt = fetchPt(focus, xt);
  if (pt) {
    const tx = xt(pt.x);
    const ty = yt(pt.y);
    compass.attr('transform', `translate(${tx},${ty})`);
    compass.select('.x-hover-line')
      .attr('y1', 0 - ty)
      .attr('y2', focus.h - ty);
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
    .attr('class', 'compass')
    .attr('display', 'none');
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

  overlay
    .on('mouseover', () => compass.attr('display', null))
    .on('mouseout', () => compass.attr('display', 'none'))
    .on('mousemove', () => mouseMove(focus, compass))
    .on('click', () => ClickCompass(focus));
};

export { MountCompass, TfRescale, ClickCompass };
