import { ClickCompass } from './compass';

const MountTags = (target) => {
  const igbPath = target.root.append('g')
    .attr('class', 'igbPath-clip')
    .attr('clip-path', 'url(#clip)');
  const igcPath = target.root.append('g')
    .attr('class', 'igcPath-clip')
    .attr('clip-path', 'url(#clip)');
  const igtPath = target.root.append('g')
    .attr('class', 'igtPath-clip')
    .attr('clip-path', 'url(#clip)');
  const pPath = target.root.append('g')
    .attr('class', 'pPath-clip')
    .attr('clip-path', 'url(#clip)');
  const bpPath = target.root.append('g')
    .attr('class', 'bpPath-clip')
    .attr('clip-path', 'url(#clip)');
  const bpTxt = target.root.append('g')
    .attr('class', 'bpTxt-clip')
    .attr('clip-path', 'url(#clip)');
  const mpybPath = target.root.append('g')
    .attr('class', 'mpybPath-clip')
    .attr('clip-path', 'url(#clip)');
  const mpyt1Path = target.root.append('g')
    .attr('class', 'mpyt1Path-clip')
    .attr('clip-path', 'url(#clip)');
  const mpyt2Path = target.root.append('g')
    .attr('class', 'mpyt2Path-clip')
    .attr('clip-path', 'url(#clip)');
  const mpypPath = target.root.append('g')
    .attr('class', 'mpypPath-clip')
    .attr('clip-path', 'url(#clip)');
  const aucPath = target.root.append('g')
    .attr('class', 'aucPath-clip')
    .attr('clip-path', 'url(#clip)');
  return {
    pPath, bpPath, bpTxt, igbPath, igcPath, igtPath, mpybPath, mpyt1Path, mpyt2Path, mpypPath, aucPath,
  };
};

const MountBars = (target) => {
  const bars = target.root.append('g')
    .attr('class', 'bars-clip')
    .attr('clip-path', 'url(#clip)');
  return bars;
};

const MountRef = (target) => {
  const ref = target.root.append('g')
    .attr('class', 'ref-clip')
    .attr('clip-path', 'url(#ref-clip)');
  return ref;
};

const MountPath = (target, color) => {
  const path = target.root.append('g')
    .attr('class', 'line-clip')
    .attr('clip-path', 'url(#clip)')
    .append('path')
    .attr('class', 'line')
    .style('fill', 'none')
    .style('stroke', color)
    .style('stroke-width', 1)
    .on('click', () => ClickCompass(target));
  return path;
};

const MountComparePath = (target, color, id) => {
  const path = target.root.append('g')
    .attr('class', 'line-clip-compare')
    .attr('id', id)
    .attr('clip-path', 'url(#clip)')
    .append('path')
    .attr('class', 'line')
    .style('fill', 'none')
    .style('stroke', color)
    .style('stroke-width', 1)
    .style('stroke-dasharray', ('30, 3'))
    .on('click', () => ClickCompass(target));
  return path;
};

const MountThresLine = (target, color) => {
  const thresLineUp = target.root.append('g')
    .attr('class', 'line-clip')
    .attr('clip-path', 'url(#clip)')
    .append('path')
    .attr('class', 'thresholdUp')
    .style('stroke-dasharray', ('3, 3'))
    .style('fill', 'none')
    .style('stroke', color)
    .style('stroke-width', 1);
  const thresLineDw = target.root.append('g')
    .attr('class', 'line-clip')
    .attr('clip-path', 'url(#clip)')
    .append('path')
    .attr('class', 'thresholdDw')
    .style('stroke-dasharray', ('3, 3'))
    .style('fill', 'none')
    .style('stroke', color)
    .style('stroke-width', 1);
  return [thresLineUp, thresLineDw];
};

const MountGrid = (target) => {
  const gridTrans = `translate(0, ${target.h})`;
  const xGrid = target.root.append('g')
    .attr('class', 'x-grid')
    .attr('transform', gridTrans);
  const yGrid = target.root.append('g')
    .attr('class', 'y-grid');
  return { x: xGrid, y: yGrid };
};

const MountAxis = (target) => {
  const xAxisTrans = `translate(0, ${target.h})`;
  const xAxis = target.root.append('g')
    .attr('class', 'x-axis')
    .attr('transform', xAxisTrans);
  const yAxis = target.root.append('g')
    .attr('class', 'y-axis');
  return { x: xAxis, y: yAxis };
};

const MountAxisLabelX = (target) => {
  const xTrans = `translate(${target.w / 2}, ${target.h + 30})`;
  target.root.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', xTrans)
    .attr('class', 'xLabel')
    .attr('font-family', 'Helvetica')
    .style('font-size', '12px');
};

const MountAxisLabelY = (target) => {
  const yR = 'rotate(-90)';
  const yTrans = `translate(${16 - target.margin.l}, ${target.h / 2}) ${yR}`;
  target.root.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', yTrans)
    .attr('class', 'yLabel')
    .attr('font-family', 'Helvetica')
    .style('font-size', '12px');
};

const MountMarker = (target, color) => {
  const tTrans = `translate(${target.w - 80}, -10)`;
  const lTrans = `translate(${target.w - 200}, -18)`;
  target.root.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', tTrans)
    .attr('class', 'mark-text')
    .attr('font-family', 'Helvetica');

  target.root.append('rect')
    .attr('transform', lTrans)
    .attr('width', 30)
    .attr('height', 5)
    .attr('class', 'mark-line')
    .style('fill', color);
};

const MountClip = (target) => {
  target.svg.append('defs')
    .append('clipPath')
    .attr('id', 'clip')
    .append('rect')
    .attr('width', target.w)
    .attr('height', target.h)
    .attr('x', 0)
    .attr('y', 0);
};

const MountMainFrame = (target, name) => {
  const transFrame = `translate(${target.margin.l}, ${target.margin.t})`;
  const clsName = `${name}-main`;

  target.svg.append('g')
    .attr('class', clsName)
    .attr('transform', transFrame);
};

export {
  MountTags, MountRef, MountPath, MountThresLine, MountGrid, MountAxis,
  MountComparePath, MountAxisLabelX, MountAxisLabelY,
  MountMarker, MountClip, MountMainFrame, MountBars,
};
