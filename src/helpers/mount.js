const MountCircles = (target) => {
  const circles = target.root.append('g')
    .attr('class', 'circles-clip')
    .attr('clip-path', 'url(#clip)');
  return circles;
};

const MountPath = (target, color) => {
  const path = target.root.append('g')
    .attr('class', 'line-clip')
    .attr('clip-path', 'url(#clip)')
    .append('path')
    .attr('class', 'line')
    .style('fill', 'none')
    .style('stroke', color)
    .style('stroke-width', 1);
  return path;
};

const MountThresLine = (target, color) => {
  const thresLine = target.root.append('g')
    .attr('class', 'line-clip')
    .attr('clip-path', 'url(#clip)')
    .append('path')
    .attr('class', 'threshold')
    .style('stroke-dasharray', ('3, 3'))
    .style('fill', 'none')
    .style('stroke', color)
    .style('stroke-width', 1);
  return thresLine;
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
  const xTrans = `translate(${target.w / 2}, ${target.h + 40})`;
  target.root.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', xTrans)
    .attr('class', 'xLabel');
};

const MountAxisLabelY = (target) => {
  const yR = 'rotate(-90)';
  const yTrans = `translate(${30 - target.margin.l}, ${target.h / 2}) ${yR}`;
  target.root.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', yTrans)
    .attr('class', 'yLabel');
};

const MountMarker = (target, color) => {
  const tTrans = `translate(${target.w - 80}, -10)`;
  const lTrans = `translate(${target.w - 200}, -18)`;
  target.root.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', tTrans)
    .attr('class', 'mark-text');

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
  MountCircles, MountPath, MountThresLine, MountGrid, MountAxis,
  MountAxisLabelX, MountAxisLabelY,
  MountMarker, MountClip, MountMainFrame,
};
