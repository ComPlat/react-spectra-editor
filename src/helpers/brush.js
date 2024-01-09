/* eslint-disable prefer-object-spread */
import * as d3 from 'd3';

import { MouseMove } from './compass';

const wheeled = (focus) => {
  const { currentExtent, scrollUiWheelAct } = focus;
  // WORKAROUND: firefox wheel compatibilty
  const wheelEvent = focus.isFirefox ? -d3.event.deltaY : d3.event.wheelDelta;  // eslint-disable-line
  const direction = wheelEvent > 0;
  scrollUiWheelAct(Object.assign({}, currentExtent, { direction }));
};

const brushed = (focus, isUiAddIntgSt, isUiAddOffsetSt) => {
  const {
    selectUiSweepAct, data, dataPks, brush, w, h, scales,
  } = focus;
  const selection = d3.event.selection && d3.event.selection.reverse();
  if (!selection) return;
  let xes = [w, 0].map(scales.x.invert).sort((a, b) => a - b);
  let yes = [h, 0].map(scales.y.invert).sort((a, b) => a - b);
  let xExtent = { xL: xes[0], xU: xes[1] };
  let yExtent = { yL: yes[0], yU: yes[1] };
  let newOtherGraphExtents = null;
  if (isUiAddIntgSt || isUiAddOffsetSt) {
    xes = selection.map(scales.x.invert).sort((a, b) => a - b);
    xExtent = { xL: xes[0], xU: xes[1] };
  } else {
    const [begPt, endPt] = selection;
    if (focus.secondaryAxisDrawn) {
      if (!focus.otherLineData[0].yUnits.toUpperCase().includes('DERIV')) {
        yes = [begPt[1], endPt[1]].map(focus.secondaryYScale.invert).sort((a, b) => a - b);
        // get yExtent for alternate graph
        const yp = [begPt[1], endPt[1]].map(scales.y.invert).sort((a, b) => a - b);
        const diff = focus.primaryExtent.yExtent.yU - focus.primaryExtent.yExtent.yL;
        newOtherGraphExtents = {
          yL: focus.primaryExtent.yExtent.yL + diff * yp[0],
          yU: focus.primaryExtent.yExtent.yL + diff * yp[1],
        };
      } else {
        yes = [begPt[1], endPt[1]].map(scales.y.invert).sort((a, b) => a - b);
        const ys = [begPt[1], endPt[1]].map(focus.secondaryYScale.invert).sort((a, b) => a - b);
        newOtherGraphExtents = {
          yL: ys[0],
          yU: ys[1],
        };
      }
      xes = [begPt[0], endPt[0]].map(scales.x.invert).sort((a, b) => a - b);
      xExtent = { xL: xes[0], xU: xes[1] };
      yExtent = { yL: yes[0], yU: yes[1] };
    } else {
      yes = [begPt[1], endPt[1]].map(scales.y.invert).sort((a, b) => a - b);
      xes = [begPt[0], endPt[0]].map(scales.x.invert).sort((a, b) => a - b);
      xExtent = { xL: xes[0], xU: xes[1] };
      yExtent = { yL: yes[0], yU: yes[1] };
    }
  }
  selectUiSweepAct({
    xExtent, yExtent, data, dataPks, newOtherGraphExtents,
  });
  d3.select('.d3Svg').selectAll('.brush').call(brush.move, null);
};

const MountBrush = (focus, isUiAddIntgSt, isUiNoBrushSt, isUiAddOffsetSt) => {
  const {
    root, svg, brush, brushX, w, h,
  } = focus;
  svg.selectAll('.brush').remove();
  svg.selectAll('.brushX').remove();

  const brushedCb = () => brushed(focus, isUiAddIntgSt, isUiAddOffsetSt);
  const wheeledCb = () => wheeled(focus);

  if (isUiNoBrushSt) {
    const target = isUiAddIntgSt || isUiAddOffsetSt ? brushX : brush;
    target.handleSize(10)
      .extent([[0, 0], [w, h]])
      .on('end', brushedCb);

    // append brush components
    const klass = isUiAddIntgSt || isUiAddOffsetSt ? 'brushX' : 'brush';
    root.append('g')
      .attr('class', klass)
      .on('mousemove', () => MouseMove(focus))
      .call(target);
  }

  svg.on('wheel', wheeledCb);
};

export default MountBrush;

// const resetedCb = () => reseted(main);
// main.svg.on('dblclick', resetedCb);
// const reseted = (main) => {
//   const { selectUiSweepAct } = main;
//   selectUiSweepAct({ xExtent: false, yExtent: false });
// };
