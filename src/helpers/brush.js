import * as d3 from 'd3';

import { LIST_UI_SWEEP_TYPE } from '../constants/list_ui';

const noBrushTypes = [
  LIST_UI_SWEEP_TYPE.PEAK_ADD,
  LIST_UI_SWEEP_TYPE.PEAK_DELETE,
  LIST_UI_SWEEP_TYPE.ANCHOR_SHIFT,
  LIST_UI_SWEEP_TYPE.INTEGRATION_RM,
  LIST_UI_SWEEP_TYPE.INTEGRATION_SET_REF,
  LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_ADD,
  LIST_UI_SWEEP_TYPE.MULTIPLICITY_PEAK_RM,
  LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_CLICK,
  LIST_UI_SWEEP_TYPE.MULTIPLICITY_ONE_RM,
];

const wheeled = (focus) => {
  const { currentExtent, scrollUiWheelAct } = focus;
  const direction = d3.event.wheelDelta > 0;
  scrollUiWheelAct(Object.assign({}, currentExtent, { direction }));
};

const brushed = (focus, uiSt) => {
  const {
    selectUiSweepAct, data, dataPks, brush, w, h, scales,
  } = focus;
  const selection = d3.event.selection && d3.event.selection.reverse();
  if (!selection) return;
  let xes = [w, 0].map(scales.x.invert).sort((a, b) => a - b);
  let yes = [h, 0].map(scales.y.invert).sort((a, b) => a - b);
  let xExtent = { xL: xes[0], xU: xes[1] };
  let yExtent = { yL: yes[0], yU: yes[1] };
  if (uiSt.sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_ADD) {
    xes = selection.map(scales.x.invert).sort((a, b) => a - b);
    xExtent = { xL: xes[0], xU: xes[1] };
  } else {
    const [begPt, endPt] = selection;
    xes = [begPt[0], endPt[0]].map(scales.x.invert).sort((a, b) => a - b);
    yes = [begPt[1], endPt[1]].map(scales.y.invert).sort((a, b) => a - b);
    xExtent = { xL: xes[0], xU: xes[1] };
    yExtent = { yL: yes[0], yU: yes[1] };
  }
  selectUiSweepAct({
    xExtent, yExtent, data, dataPks,
  });
  d3.select('.d3Svg').selectAll('.brush').call(brush.move, null);
};

const MountBrush = (focus, uiSt) => {
  const {
    root, svg, brush, brushX, w, h,
  } = focus;
  svg.selectAll('.brush').remove();
  svg.selectAll('.brushX').remove();

  const brushedCb = () => brushed(focus, uiSt);
  const wheeledCb = () => wheeled(focus);

  if (noBrushTypes.indexOf(uiSt.sweepType) < 0) {
    const target = uiSt.sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_ADD
      ? brushX : brush;
    target.handleSize(10)
      .extent([[0, 0], [w, h]])
      .on('end', brushedCb);

    // append brush components
    const klass = uiSt.sweepType === LIST_UI_SWEEP_TYPE.INTEGRATION_ADD
      ? 'brushX' : 'brush';
    root.append('g')
      .attr('class', klass)
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
