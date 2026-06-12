import {
  calcArea,
  getIntegrationPoints,
  getLinearBaseline,
  getVisualSplitGroups,
} from './integration';
import { itgIdTag } from './focus';
import { TfRescale } from './compass';
import Cfg from './cfg';
import {
  clearIntegrationSplitPreview,
  drawIntegrationSplitPreview,
  drawIntegrationVisualSplitLines,
  getSplitXFromEvent,
  resolveSplitTarget,
  getVisualSplitLineAtX,
  isAlreadyVisuallySplit,
  isMergedVisualSplitGroup,
} from './integration_split';

const d3 = require('d3');

const buildIntegrationGroups = (stack = []) => (
  getVisualSplitGroups(stack).map((group) => ({
    xL: group.xL,
    xU: group.xU,
    isMerged: group.isMerged,
    groupId: group.groupId,
    target: group.items[0],
  }))
);

const buildIntegrationBarData = (layout, stack = []) => {
  const showIntegSplit = Cfg.showIntegSplitTools(layout);
  const igGroups = buildIntegrationGroups(stack);
  return {
    showIntegSplit,
    igGroups,
    igBarData: showIntegSplit ? igGroups : stack,
  };
};

const handleIntegrationMouseMove = (focus, event, data, shift, ignoreRef) => {
  if (!focus.isUiSplitIntgSt && !focus.isUiVisualSplitIntgSt) return;
  if (focus.isUiVisualSplitIntgSt && isAlreadyVisuallySplit(data)) {
    clearIntegrationSplitPreview(focus);
    return;
  }
  if (focus.isUiSplitIntgSt && isMergedVisualSplitGroup(data)) {
    clearIntegrationSplitPreview(focus);
    return;
  }
  const splitX = getSplitXFromEvent(event, focus);
  const previewTarget = resolveSplitTarget(focus, data, splitX) || data;
  drawIntegrationSplitPreview(focus, previewTarget, splitX, shift, ignoreRef);
};

const handleIntegrationClick = (focus, event, data, fallbackClick) => {
  if (!focus.isUiSplitIntgSt && !focus.isUiVisualSplitIntgSt) {
    if (typeof fallbackClick === 'function') fallbackClick(event, data);
    return;
  }

  event.stopPropagation();
  event.preventDefault();
  const splitX = getSplitXFromEvent(event, focus);
  clearIntegrationSplitPreview(focus);
  const target = resolveSplitTarget(focus, data, splitX);
  if (!target) return;

  if (focus.isUiVisualSplitIntgSt) {
    const { stack = [], shift = 0 } = focus.integrationSplitTargets || {};
    const existingSplitX = getVisualSplitLineAtX(focus, stack, splitX, shift);
    if (Number.isFinite(existingSplitX)) {
      if (typeof focus.removeVisualSplitLineAct !== 'function') return;
      focus.removeVisualSplitLineAct({
        curveIdx: focus.jcampIdx,
        splitX: existingSplitX,
        data: focus.data,
      });
      return;
    }
    if (isAlreadyVisuallySplit(target)) return;
    if (typeof focus.addVisualSplitLineAct !== 'function') return;
    focus.addVisualSplitLineAct({
      curveIdx: focus.jcampIdx,
      target,
      splitX,
      data: focus.data,
    });
    return;
  }

  if (isMergedVisualSplitGroup(data)) return;
  if (typeof focus.splitIntegrationAct !== 'function') return;
  focus.splitIntegrationAct({
    curveIdx: focus.jcampIdx,
    target,
    splitX,
    data: focus.data,
  });
};

const handleVisualSplitLineClick = (focus, event, splitX) => {
  event.stopPropagation();
  event.preventDefault();
  clearIntegrationSplitPreview(focus);
  if (typeof focus.removeVisualSplitLineAct !== 'function') return;
  focus.removeVisualSplitLineAct({
    curveIdx: focus.jcampIdx,
    splitX,
    data: focus.data,
  });
};

const drawVisualSplitLinesForFocus = (focus, stack, shift, ignoreRef) => {
  drawIntegrationVisualSplitLines(
    focus,
    stack,
    shift,
    ignoreRef,
    focus.isUiVisualSplitIntgSt,
    (event, splitX) => handleVisualSplitLineClick(focus, event, splitX),
  );
};

const drawIntegrationAUC = (focus, stack, shift = 0) => {
  const { xt, yt } = TfRescale(focus);
  const groups = buildIntegrationGroups(stack);
  const auc = focus.tags.aucPath.selectAll('path').data(groups);
  auc.exit()
    .attr('class', 'exit')
    .remove();

  const integCurve = (border) => {
    const { xL, xU } = border;
    const ps = getIntegrationPoints(xL - shift, xU - shift, focus.data);
    if (!ps[0]) return null;

    const baselineY = getLinearBaseline(ps);

    return d3.area()
      .x((d) => xt(d.x))
      .y0((d) => yt(baselineY(d)))
      .y1((d) => yt(d.y))(ps);
  };

  const showIntegSplit = Cfg.showIntegSplitTools(focus.layout);
  auc.enter()
    .append('path')
    .attr('class', 'auc')
    .attr('fill', 'red')
    .attr('stroke', 'none')
    .attr('fill-opacity', 0.2)
    .attr('stroke-width', 2)
    .merge(auc)
    .attr('d', (d) => integCurve(d))
    .attr('id', (d) => `auc${itgIdTag(d)}`)
    .on('mouseover', (event, d) => {
      d3.select(`#auc${itgIdTag(d)}`)
        .attr('stroke', 'blue');
      d3.select(`#auc${itgIdTag(d)}`)
        .style('fill', 'blue');
    })
    .on('mouseout', (event, d) => {
      d3.select(`#auc${itgIdTag(d)}`)
        .attr('stroke', 'none');
      d3.select(`#auc${itgIdTag(d)}`)
        .style('fill', 'red');
      d3.select(`#auc${itgIdTag(d)}`)
        .style('fill-opacity', 0.2);
      if (showIntegSplit) clearIntegrationSplitPreview(focus);
    })
    .on('mousemove', showIntegSplit
      ? (event, d) => handleIntegrationMouseMove(focus, event, d, shift, true)
      : null)
    .on('click', (event, d) => handleIntegrationClick(
      focus,
      event,
      d,
      (clickEvent, clickData) => focus.onClickTarget(clickEvent, clickData),
    ));
};

const bindSplitMouseHandlers = ({
  focus, shift, ignoreRef, showIntegSplit, fallbackClick,
}) => ({
  mouseout: (event, d) => {
    d3.select(`#igbp${itgIdTag(d)}`)
      .attr('stroke', '#228B22');
    d3.select(`#igbc${itgIdTag(d)}`)
      .attr('stroke', '#228B22');
    d3.select(`#igtp${itgIdTag(d)}`)
      .style('fill', '#228B22');
    if (showIntegSplit) clearIntegrationSplitPreview(focus);
  },
  mousemove: showIntegSplit
    ? (event, d) => handleIntegrationMouseMove(focus, event, d, shift, ignoreRef)
    : null,
  click: (event, d) => handleIntegrationClick(focus, event, d, fallbackClick),
});

export {
  bindSplitMouseHandlers,
  buildIntegrationBarData,
  buildIntegrationGroups,
  drawIntegrationAUC,
  drawVisualSplitLinesForFocus,
  handleIntegrationClick,
  handleIntegrationMouseMove,
  handleVisualSplitLineClick,
};
